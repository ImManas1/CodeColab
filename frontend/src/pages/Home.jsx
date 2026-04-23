import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRoom } from "../context/RoomContext";
import "./Home.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("initialize");
  const [developerId, setDeveloperId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId } = useRoom();

  useEffect(() => {
    // If redirected here via direct link without a Developer ID, prefill the room code
    const queryParams = new URLSearchParams(location.search);
    const roomParam = queryParams.get("room");
    if (roomParam) {
      setRoomCode(roomParam);
      setActiveTab("attach");
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!developerId.trim()) return;

    // Save the developer's chosen name so Room can use it as the socket identity
    const newUserId = developerId.trim();
    sessionStorage.setItem("cc_user_id", newUserId);
    setUserId(newUserId); // Fix: Update context state immediately so it's not null

    if (activeTab === "initialize") {
      const roomId = Math.random().toString(36).substring(2, 8);
      navigate(`/room/${roomId}`);
    } else {
      if (!roomCode.trim()) return;
      navigate(`/room/${roomCode.trim()}`);
    }
  };

  const joinSample = () => {
    const guestId = "guest_" + Math.random().toString(36).substring(2, 5);
    sessionStorage.setItem("cc_user_id", guestId);
    setUserId(guestId);
    navigate(`/room/sample123`);
  };

  return (
    <div className="home-container">
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

      <div className="home-content">
        <div className="home-header">
          <div className="home-brand">
            <span className="brand-square"></span> CODECOLAB // TERMINAL
          </div>

          <h1 className="home-title">
            Sync.<br />
            Compile.<br />
            Execute.
          </h1>

          <p className="home-subtitle">
            A zero-friction, real-time collaboration<br />
            environment built for engineers.
          </p>
        </div>

        {!isLoginPanelOpen && (
          <div className="auth-panel">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === "initialize" ? "active" : ""}`}
                onClick={() => setActiveTab("initialize")}
              >
                CREATE ROOM
              </button>

              <button
                className={`auth-tab ${activeTab === "attach" ? "active" : ""}`}
                onClick={() => setActiveTab("attach")}
              >
                JOIN ROOM
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>USER NAME</label>
                <input
                  type="text"
                  placeholder="e.g. user1"
                  value={developerId}
                  onChange={(e) => setDeveloperId(e.target.value)}
                />
              </div>

              {activeTab === "attach" && (
                <div className="input-group">
                  <label>ROOM CODE</label>
                  <input
                    type="text"
                    placeholder="e.g. ab3x9f"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="auth-submit">
                {activeTab === "initialize" ? "Create Session" : "Join Session"}
              </button>
            </form>

            <div className="auth-footer" onClick={joinSample}>
              [ TRY A SAMPLE SESSION ]
            </div>
          </div>
        )}
      </div>

      <div className={`side-login-panel ${isLoginPanelOpen ? "open" : ""}`}>
        <button
          className="side-login-tab"
          onClick={() => setIsLoginPanelOpen(!isLoginPanelOpen)}
        >
          {isLoginPanelOpen ? "CLOSE" : "LOG IN"}
        </button>

        <div className="side-login-content">
          <h2 style={{ fontSize: "22px", marginBottom: "32px" }}>
            Access Account
          </h2>

          <button className="github-btn">
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}