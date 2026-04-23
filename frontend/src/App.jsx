import Editor from "@monaco-editor/react";
import { useState } from "react";

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput("Error connecting to server");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* 🔷 Header */}
      <div
        style={{
          height: "50px",
          background: "#1e1e2f",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 15px",
        }}
      >
        <h3>⚡ CodeColab</h3>

        <button
          onClick={runCode}
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ▶ Run Code
        </button>
      </div>

      {/* 🔷 Main Layout */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* 🟦 Editor */}
        <div style={{ width: "65%", borderRight: "2px solid #222" }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
          />
        </div>

        {/* 🟨 Right Panel */}
        <div
          style={{
            width: "35%",
            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* 🟩 Output */}
          <div
            style={{
              flex: 1,
              background: "#000",
              color: "#00ff9c",
              padding: "10px",
              overflow: "auto",
            }}
          >
            <h4>🧾 Output</h4>
            <pre>{output}</pre>
          </div>

          {/* 🟪 Chat */}
          <div
            style={{
              flex: 1,
              background: "#1e1e2f",
              color: "white",
              padding: "10px",
            }}
          >
            <h4>💬 Chat</h4>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;