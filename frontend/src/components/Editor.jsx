import MonacoEditor from "@monaco-editor/react";
import { useRoom } from "../context/RoomContext";
import { socket } from "../socket/socket";
import { useEffect, useState } from "react";

export default function Editor({ theme = 'dark' }) {
  const {
    files,
    setFiles,
    activeFileId,
    setActiveFileId,
    isTeachingMode,
    isHost,
    userId,
    getLanguage,
  } = useRoom();

  const [remoteCursors, setRemoteCursors] = useState({});
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const activeFile = files.find(f => f.id === activeFileId);
  const lang = activeFile ? getLanguage(activeFile.name) : "plaintext";

  const addNewFile = () => {
    const name = prompt("Enter new file name (e.g., script.py):");
    if (name) {
      const newFile = { id: Date.now().toString(), name, content: "" };
      const newFiles = [...files, newFile];
      setFiles(newFiles);
      setActiveFileId(newFile.id);
      socket.emit("sync_files", { files: newFiles });
    }
  };

  const closeFile = () => {
    if (!activeFile) return;
    if (confirm(`Are you sure you want to delete ${activeFile.name}?`)) {
      const newFiles = files.filter(f => f.id !== activeFileId);
      setFiles(newFiles);
      setActiveFileId(newFiles.length > 0 ? newFiles[0].id : null);
      socket.emit("sync_files", { files: newFiles });
    }
  };

  const handleEditorChange = (value) => {
    const updatedContent = value || "";

    setFiles(prev =>
      prev.map(f =>
        String(f.id) === String(activeFileId)
          ? { ...f, content: updatedContent }
          : f
      )
    );

    socket.emit("code_change", {
      userId,
      fileId: String(activeFileId),
      code: updatedContent,
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
  };

  useEffect(() => {
    const handleIncomingCode = ({ fileId, code, userId: senderId }) => {
      setFiles(prev =>
        prev.map(f => {
          if (String(f.id) !== String(fileId)) return f;
          if (f.content === code) return f;
          return { ...f, content: code };
        })
      );
      
      // Flash a pseudo-cursor badge (basic implementation for UI effect)
      setRemoteCursors(prev => ({ ...prev, [senderId]: true }));
      setTimeout(() => {
        setRemoteCursors(prev => {
          const next = { ...prev };
          delete next[senderId];
          return next;
        });
      }, 2000);
    };

    socket.on("code_update", handleIncomingCode);
    return () => socket.off("code_update", handleIncomingCode);
  }, [setFiles]);

  return (
    <>
      <div className="editor-tabs">
        {activeFile && (
          <div className="editor-tab">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--brand-color)' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V4.5L18.5 9H13z" />
            </svg>
            {activeFile.name}
            <span onClick={closeFile} style={{ marginLeft: '4px', opacity: 0.5, cursor: 'pointer' }}>×</span>
          </div>
        )}
      </div>

      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={lang}
          value={activeFile?.content || ""}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={theme === 'light' ? 'vs' : 'vs-dark'}
          options={{
            readOnly: isTeachingMode && !isHost,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 24,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
          }}
        />
        
        {/* Mock remote cursors for UI effect */}
        {Object.keys(remoteCursors).map((senderId, i) => (
          <div key={senderId} className="user-cursor-badge" style={{ top: `${40 + i * 30}px`, right: '40px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
              {senderId.charAt(0).toUpperCase()}
            </div>
            {senderId}
          </div>
        ))}
      </div>

      <div className="status-bar">
        <div className="status-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="connection-dot" style={{ marginLeft: 0 }} />
            Connected
          </div>
          <div>{lang === 'python' ? 'Python 3.11.0' : lang === 'javascript' ? 'Node.js' : 'Ready'}</div>
        </div>
        <div className="status-center">
          <div>{activeFile ? `Ln ${cursorPos.line}, Col ${cursorPos.col}` : 'Ready'}</div>
          <div>Spaces: 4</div>
          <div>UTF-8</div>
          <div>LF</div>
          <div style={{ textTransform: 'capitalize' }}>{lang}</div>
        </div>
        <div className="status-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            All changes saved
          </div>
        </div>
      </div>
    </>
  );
}