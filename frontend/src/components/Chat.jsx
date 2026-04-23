import { useRoom } from '../context/RoomContext';
import { useState, useEffect } from 'react';

export default function Chat() {
  const { isTeachingMode } = useRoom();
  const [isRemoteTyping, setIsRemoteTyping] = useState(true); // Mocked for demonstration

  // Optional: Toggle the mock typing indicator every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRemoteTyping(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-panel">
      <div className="panel-header">
        <div className="panel-title">Team Discussion</div>
      </div>
      <div className="chat-messages">
        <div style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
          Welcome to the collaboration room! {isTeachingMode ? "Teaching mode is currently active." : ""}
        </div>
      </div>
      <div className="chat-input-area" style={{ position: 'relative' }}>
        {/* Remote User Cursor / Typing Indicator */}
        {isRemoteTyping && (
          <div className="remote-cursor-typing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
              <path d="M5.5 2.5L20.5 10L12 12L10 20.5L5.5 2.5Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <div className="remote-cursor-name">John Doe is typing...</div>
          </div>
        )}
        <input type="text" className="chat-input" placeholder="Discuss code with your team..." />
      </div>
    </div>
  );
}
