import { useState } from 'react';
import './Home.css';

export default function Home({ onJoinRoom }) {
  const [activeTab, setActiveTab] = useState('initialize');
  const [developerId, setDeveloperId] = useState('');
  const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (developerId.trim() || activeTab === 'sample') {
      onJoinRoom(developerId);
    }
  };

  return (
    <div className="home-container">
      {/* Sci-fi Background mimicking Image 2 */}
      <div className="cyber-bg">
        <div className="cyber-grid-top"></div>
        <div className="cyber-grid-bottom"></div>
        <div className="cyber-glow"></div>
        <div className="cyber-flare"></div>
        <div className="cyber-particles">
          <span className="binary-text b1">0 1 0 1</span>
          <span className="binary-text b2">0 0 1</span>
          <span className="binary-text b3">1 0 1 1 0</span>
          <span className="binary-text b4">0 1</span>
          <span className="binary-text b5">1 0</span>
        </div>
      </div>

      {/* Foreground UI mimicking Image 1 */}
      <div className="home-content">
        <div className="home-header">
          <div className="home-brand"><span className="brand-square"></span> CODECOLAB // TERMINAL</div>
          <h1 className="home-title">
            Sync.<br/>
            Compile.<br/>
            Execute.
          </h1>
          <p className="home-subtitle">
            A zero-friction, real-time collaboration<br/>
            environment built for engineers. No bloated UI,<br/>
            just raw execution and presence.
          </p>
        </div>

        {/* Only show Developer ID / Auth Panel when login panel is closed */}
        {!isLoginPanelOpen && (
          <div className="auth-panel" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === 'initialize' ? 'active' : ''}`}
                onClick={() => setActiveTab('initialize')}
              >
                INITIALIZE SESSION
              </button>
              <button 
                className={`auth-tab ${activeTab === 'attach' ? 'active' : ''}`}
                onClick={() => setActiveTab('attach')}
              >
                ATTACH TO SESSION
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>DEVELOPER ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. root_user"
                  value={developerId}
                  onChange={(e) => setDeveloperId(e.target.value)}
                  required={activeTab !== 'sample'}
                />
              </div>
              
              <button type="submit" className="auth-submit">
                Create Context
              </button>
            </form>

            <div className="auth-footer" onClick={() => onJoinRoom('sample_user')}>
              [ TRY A SAMPLE SESSION ]
            </div>
          </div>
        )}
      </div>

      {/* Side Login Panel */}
      <div className={`side-login-panel ${isLoginPanelOpen ? 'open' : ''}`}>
        <button 
          className="side-login-tab"
          onClick={() => setIsLoginPanelOpen(!isLoginPanelOpen)}
        >
          {isLoginPanelOpen ? 'CLOSE' : 'LOG IN'}
        </button>

        <div className="side-login-content">
          <h2 style={{ fontSize: '24px', marginBottom: '32px', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>Access Account</h2>
          
          <button className="github-btn" onClick={() => alert("GitHub Login Mock")}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <form className="auth-form" style={{ marginTop: 0 }} onSubmit={(e) => { e.preventDefault(); alert("Email login mock"); }}>
            <div className="input-group">
              <label>EMAIL ADDRESS</label>
              <input type="email" placeholder="you@example.com" required style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>
            <div className="input-group">
              <label>PASSWORD</label>
              <input type="password" placeholder="••••••••" required style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>
            
            <button type="submit" className="auth-submit" style={{ marginTop: '12px' }}>
              Sign In / Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
