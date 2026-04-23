import { createContext, useState, useContext } from 'react';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [files, setFiles] = useState([
    { id: 1, name: 'main.py', content: 'print("Hello Python!")\n' },
    { id: 2, name: 'index.js', content: 'console.log("Hello JS");\n' }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [isTeachingMode, setIsTeachingMode] = useState(false);
  const [isHost, setIsHost] = useState(true);

  return (
    <RoomContext.Provider value={{
      files, setFiles,
      activeFileId, setActiveFileId,
      isTeachingMode, setIsTeachingMode,
      isHost, setIsHost
    }}>
      {children}
    </RoomContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom = () => useContext(RoomContext);
