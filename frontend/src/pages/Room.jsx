import { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import Navbar from '../components/Navbar';
import FileExplorer from '../components/FileExplorer';
import Editor from '../components/Editor';
import Output from '../components/Output';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import { executeCode } from '../api/execute';

export default function Room() {
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);

  const { files, activeFileId } = useRoom();
  const activeFile = files.find(f => f.id === activeFileId);

  const getLanguage = (filename) => {
    if (!filename) return 'plaintext';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.c') || filename.endsWith('.cpp')) return 'cpp';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    return 'plaintext';
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setIsError(false);
    setOutput("Running code...");
    
    try {
      const data = await executeCode(activeFile?.content || "", getLanguage(activeFile?.name));
      setOutput(data.output || "No output");
      if (data.error) setIsError(true);
    } catch (err) {
      setIsError(true);
      setOutput(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar onRunCode={handleRunCode} isRunning={isRunning} />
      
      <main className="workspace">
        <FileExplorer 
          isVisible={isExplorerOpen} 
          toggleVisibility={() => setIsExplorerOpen(!isExplorerOpen)} 
        />
        
        <Editor />

        <aside className="sidebar">
          <UserList />
          <Output output={output} isError={isError} />
          <Chat />
        </aside>
      </main>
    </div>
  );
}
