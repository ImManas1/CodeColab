import { useRoom } from "../context/RoomContext";

export default function Output() {
  const { output, isError, isRunning, runCode } = useRoom();

  const handleRun = () => {
    runCode(); // refs in context always have latest files/ids — no args needed
  };

  return (
    <div className="console-panel">
      <div className="panel-header" style={{ justifyContent: "space-between" }}>
        <div className="panel-title">Terminal Output</div>
        <button className="run-btn" onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div
        className={`console-output ${isError ? "has-error" : ""} ${
          !output ? "is-empty" : ""
        }`}
      >
        {output ? (
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {output}
          </pre>
        ) : (
          "Terminal is empty. Run some code to see output."
        )}
      </div>
    </div>
  );
}