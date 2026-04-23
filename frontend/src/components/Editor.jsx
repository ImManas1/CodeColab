import MonacoEditor from "@monaco-editor/react";
import { useRoom } from '../context/RoomContext';

export default function Editor() {
  const { files, setFiles, activeFileId, isTeachingMode, isHost } = useRoom();
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

  const handleEditorChange = (value) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: value || "" } : f));
  };

  return (
    <section className="editor-container">
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <div className="file-tab">{activeFile?.name || "No file selected"}</div>
        {activeFile && (
          <div className="lang-badge">{getLanguage(activeFile.name)}</div>
        )}
      </div>
      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={getLanguage(activeFile?.name)}
          value={activeFile?.content || ""}
          onChange={handleEditorChange}
          theme="vs-dark"
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
            renderLineHighlight: "all"
          }}
        />
      </div>
    </section>
  );
}
