import MonacoEditor from "@monaco-editor/react";
import { useRoom } from "../context/RoomContext";
import { socket } from "../socket/socket";
import { useEffect } from "react";

export default function Editor() {
  const {
    files,
    setFiles,
    activeFileId,
    isTeachingMode,
    isHost,
    userId,       // Fix #5: now correctly provided by context
    getLanguage,
  } = useRoom();

  const activeFile = files.find(f => f.id === activeFileId);

  // SEND CODE
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

  // RECEIVE CODE
  useEffect(() => {
    const handleIncomingCode = ({ fileId, code }) => {
      setFiles(prev =>
        prev.map(f => {
          if (String(f.id) !== String(fileId)) return f;
          if (f.content === code) return f; // prevent infinite loop
          return { ...f, content: code };
        })
      );
    };

    socket.on("code_update", handleIncomingCode);

    // Fix #6: Only remove THIS specific listener, not all socket listeners
    return () => {
      socket.off("code_update", handleIncomingCode);
    };
  }, [setFiles]);

  return (
    <section className="editor-container">
      <div className="panel-header" style={{ justifyContent: "space-between" }}>
        <div className="file-tab">
          {activeFile?.name || "No file selected"}
        </div>
        {activeFile && (
          <div className="lang-badge">
            {getLanguage(activeFile.name)}
          </div>
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
            renderLineHighlight: "all",
          }}
        />
      </div>
    </section>
  );
}