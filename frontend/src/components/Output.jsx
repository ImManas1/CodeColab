export default function Output({ output, isError }) {
  return (
    <div className="console-panel">
      <div className="panel-header">
        <div className="panel-title">Terminal Output</div>
      </div>
      <div className={`console-output ${isError ? 'has-error' : ''} ${!output ? 'is-empty' : ''}`}>
        {output ? (
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}</pre>
        ) : (
          "Terminal is empty. Run some code to see output."
        )}
      </div>
    </div>
  );
}
