import { createContext, useState, useContext, useRef, useCallback } from 'react';
import { executeCode } from '../api/execute';

const RoomContext = createContext();

export const getLanguage = (filename) => {
  if (!filename) return 'plaintext';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.c') || filename.endsWith('.cpp')) return 'cpp';
  if (filename.endsWith('.java')) return 'java';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.json')) return 'json';
  return 'plaintext';
};

export const RoomProvider = ({ children }) => {
  const [files, setFiles] = useState([
    { id: '1', name: 'main.py', content: 'print("Hello Python!")\n' },
    { id: '2', name: 'index.js', content: 'console.log("Hello JS");\n' }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  const [isTeachingMode, setIsTeachingMode] = useState(false);

  // Fix: Read developer's chosen name from sessionStorage (set by Home.jsx before navigation).
  // If not present (e.g. they arrived via direct link), return null so Room.jsx can redirect them to Home.
  const [userId, setUserId] = useState(() => {
    return sessionStorage.getItem('cc_user_id') || null;
  });

  const [roomId, setRoomId] = useState(null);

  // Fix: isHost starts false — the server tells us who the host is via room_state.
  // This prevents every user thinking they are the host.
  const [isHost, setIsHost] = useState(false);

  // Centralized run state
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Fix: Use refs so runCode always reads current values without stale closure issues.
  const filesRef = useRef(files);
  const activeFileIdRef = useRef(activeFileId);
  const roomIdRef = useRef(roomId);
  const userIdRef = useRef(userId);

  // Keep refs in sync with state
  const setFilesAndRef = useCallback((updater) => {
    setFiles((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      filesRef.current = next;
      return next;
    });
  }, []);

  const setActiveFileIdAndRef = useCallback((id) => {
    activeFileIdRef.current = id;
    setActiveFileId(id);
  }, []);

  const setRoomIdAndRef = useCallback((id) => {
    roomIdRef.current = id;
    setRoomId(id);
  }, []);

  // Fix: runCode uses refs so it always has the latest file content — no stale closures.
  const runCode = useCallback(async () => {
    const activeFile = filesRef.current.find(f => f.id === activeFileIdRef.current);
    if (!activeFile) return;

    setIsRunning(true);
    setOutput('Running...');
    setIsError(false);

    try {
      const res = await executeCode(
        activeFile.content,
        getLanguage(activeFile.name),
        roomIdRef.current,
        userIdRef.current
      );

      if (res.error) {
        setIsError(true);
        setOutput(res.error);
      } else {
        setOutput(res.output);
        setIsError(false);
      }
    } catch {
      setIsError(true);
      setOutput('Execution failed. Is the backend running?');
    } finally {
      setIsRunning(false);
    }
  }, []);

  return (
    <RoomContext.Provider value={{
      files,
      setFiles: setFilesAndRef,
      activeFileId,
      setActiveFileId: setActiveFileIdAndRef,
      isTeachingMode, setIsTeachingMode,
      isHost, setIsHost,
      userId, setUserId,
      roomId,
      setRoomId: setRoomIdAndRef,
      output, isError, isRunning, runCode,
      getLanguage,
    }}>
      {children}
    </RoomContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom = () => useContext(RoomContext);
