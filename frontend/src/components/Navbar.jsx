import { useRoom } from '../context/RoomContext';

export default function Navbar({ onRunCode, isRunning }) {
  const { isTeachingMode, setIsTeachingMode, isHost } = useRoom();

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">{'</>'}</div>
        <div className="brand-name">CodeColab</div>
      </div>

      <div className="header-actions">
        {isTeachingMode && !isHost && (
          <div className="teaching-indicator">
            <span className="pulse-dot"></span>
            Observing Host
          </div>
        )}
        
        {isHost && (
          <button 
            className={`teaching-btn ${isTeachingMode ? 'active' : ''}`}
            onClick={() => setIsTeachingMode(!isTeachingMode)}
          >
            {isTeachingMode ? '🛑 End Teaching Mode' : '🎓 Start Teaching Mode'}
          </button>
        )}

        <button 
          className="run-btn" 
          onClick={onRunCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="30" strokeLinecap="round" className="spinner-anim">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>
    </header>
  );
}
