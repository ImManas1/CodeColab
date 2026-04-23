import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useRoom } from "../context/RoomContext";

import Navbar from "../components/Navbar";
import FileExplorer from "../components/FileExplorer";
import Editor from "../components/Editor";
import Output from "../components/Output";
import Chat from "../components/Chat";
import UserList from "../components/UserList";

export default function Room() {
  const { roomId: roomIdParam } = useParams();
  const navigate = useNavigate();
  const { userId, setRoomId, setIsHost, setFiles } = useRoom();

  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(
    socket.connected ? "connected" : "connecting"
  );

  useEffect(() => {
    if (!roomIdParam) return;

    // If the user arrived via direct link without a Developer ID,
    // redirect them to the home page to enter their name, and pass the room code.
    if (!userId) {
      navigate(`/?room=${roomIdParam}`, { replace: true });
      return;
    }

    setRoomId(roomIdParam);

    // Helper: emit join_room. Called on initial mount AND on every reconnect.
    const joinRoom = () => {
      console.log(`[Room] Joining ${roomIdParam} as ${userId}`);
      socket.emit("join_room", { roomId: roomIdParam, userId });
    };

    // If already connected, join immediately.
    // If not yet connected, socket.io buffers the emit — but we also
    // listen to "connect" to handle reconnects where the buffer is flushed.
    joinRoom();

    // Fix: On reconnect the server loses socket.roomId, so we MUST re-emit join_room.
    // "connect" fires both on first connection AND every reconnect.
    socket.on("connect", joinRoom);
    socket.on("connect", () => setConnectionStatus("connected"));
    socket.on("disconnect", () => setConnectionStatus("disconnected"));
    socket.on("connect_error", () => setConnectionStatus("error"));

    // Fix: Sync isHost from server — the first person in a room is the host.
    // room_state fires once when we join and tells us who the host is AND sends current files.
    const handleRoomState = ({ hostId, files }) => {
      setIsHost(hostId === userId);
      if (files) {
        setFiles(files);
      }
    };

    // host_changed fires when host transfers or disconnects and a new host is picked.
    const handleHostChanged = ({ hostId }) => {
      setIsHost(hostId === userId);
    };

    // files_update fires when files are added, deleted, or uploaded
    const handleFilesUpdate = ({ files }) => {
      if (files) {
        setFiles(files);
      }
    };

    socket.on("room_state", handleRoomState);
    socket.on("host_changed", handleHostChanged);
    socket.on("files_update", handleFilesUpdate);

    return () => {
      socket.emit("leave_room", { roomId: roomIdParam, userId });
      socket.off("connect", joinRoom);
      socket.off("room_state", handleRoomState);
      socket.off("host_changed", handleHostChanged);
      socket.off("files_update", handleFilesUpdate);
    };
  }, [roomIdParam, userId, setRoomId, setIsHost]);

  return (
    <div className="app-layout">
      <Navbar connectionStatus={connectionStatus} />

      <main className="workspace">
        <FileExplorer
          isVisible={isExplorerOpen}
          toggleVisibility={() => setIsExplorerOpen(!isExplorerOpen)}
        />

        <Editor />

        <aside className="sidebar">
          <UserList />
          <Output />
          <Chat />
        </aside>
      </main>
    </div>
  );
}