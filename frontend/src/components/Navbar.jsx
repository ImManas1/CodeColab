import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';

export default function Navbar({ connectionStatus }) {
  const {
    isTeachingMode, setIsTeachingMode,
    isHost, runCode, isRunning,
    roomId, userId,
  } = useRoom();

  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statusColor = {
    connected: 'var(--success)',
    disconnected: 'var(--error)',
    connecting: 'var(--warning)',
    error: 'var(--error)',
  }[connectionStatus] ?? 'var(--text-muted)';

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">{'</>'}</div>
        <div className="brand-name">CodeColab</div>

        {/* Connection status dot */}
        <div
          title={`Socket: ${connectionStatus}`}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 6px ${statusColor}`,
            marginLeft: 4,
          }}
        />
      </div>

      <div className="header-actions">

        {/* User identity chip */}
        {userId && (
          <div style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: 6,
          }}>
            @{userId}
          </div>
        )}

        {/* Room share badge */}
        {roomId && (
          <button
            className="room-share-btn"
            onClick={handleCopyRoomId}
            title="Click to copy room code"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 11H16V13H8V11Z" />
            </svg>
            <span className="room-id-code">{roomId}</span>
            <span className="copy-label">{copied ? '✓ Copied!' : 'Copy'}</span>
          </button>
        )}

        {/* Teaching mode indicator (for guests) */}
        {isTeachingMode && !isHost && (
          <div className="teaching-indicator">
            <span className="pulse-dot"></span>
            Observing Host
          </div>
        )}

        {/* Teaching mode toggle (host only) */}
        {isHost && (
          <button
            className={`teaching-btn ${isTeachingMode ? 'active' : ''}`}
            onClick={() => setIsTeachingMode(!isTeachingMode)}
          >
            {isTeachingMode ? '🛑 End Teaching' : '🎓 Teach'}
          </button>
        )}

        {/* Run Code */}
        <button
          className="run-btn"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="30" strokeLinecap="round">
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

        {/* Leave Session */}
        <button
          className="leave-btn"
          onClick={() => navigate('/')}
          title="Leave Session"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            borderRadius: '6px',
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#f87171';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
          Leave
        </button>
      </div>
    </header>
  );
}
