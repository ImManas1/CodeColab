import { useState, useEffect } from "react";
import { socket } from "../socket/socket";
import { useRoom } from "../context/RoomContext";

export default function Chat() {
  const { userId } = useRoom(); // Fix #5: userId now correctly provided by context

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // RECEIVE MESSAGES
  useEffect(() => {
    const handleIncoming = ({ userId: senderId, message: text }) => {
      setMessages(prev => [...prev, { userId: senderId, message: text }]);
    };

    socket.on("chat_update", handleIncoming);

    // Fix #6: Only remove THIS specific listener, not all socket listeners
    return () => {
      socket.off("chat_update", handleIncoming);
    };
  }, []);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat_message", {
      userId,   // Fix #5: no longer undefined
      message,
    });

    setMessage("");
  };

  return (
    <div className="chat-panel">
      <div className="panel-header">
        <div className="panel-title">Chat</div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.userId}:</b> {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
      </div>
    </div>
  );
}