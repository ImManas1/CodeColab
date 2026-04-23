import { useState, useEffect } from 'react';
import { socket } from '../socket/socket';
import { useRoom } from '../context/RoomContext';

export default function UserList() {
  const { userId, roomId } = useRoom();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [hostId, setHostId] = useState(null);

  // Receive real user list from backend on join and on changes
  useEffect(() => {
    // room_state fires once when we first join — gives us the full snapshot
    const handleRoomState = ({ users: userList, hostId: hId }) => {
      setUsers(userList);
      setHostId(hId);
    };

    // user_list_update fires whenever anyone joins or leaves
    const handleUserListUpdate = (userList) => {
      setUsers(userList);
    };

    // host_changed fires when host transfers or disconnects
    const handleHostChanged = ({ hostId: hId }) => {
      setHostId(hId);
      setUsers(prev => prev.map(u => ({ ...u, isHost: u.userId === hId })));
    };

    socket.on('room_state', handleRoomState);
    socket.on('user_list_update', handleUserListUpdate);
    socket.on('host_changed', handleHostChanged);

    return () => {
      socket.off('room_state', handleRoomState);
      socket.off('user_list_update', handleUserListUpdate);
      socket.off('host_changed', handleHostChanged);
    };
  }, []);

  return (
    <div className="user-list-panel">
      <div
        className="panel-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isCollapsed ? '0' : '12px',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>Online Users ({users.length})</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </div>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              No users yet...
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: u.userId === userId ? 'var(--text-accent)' : 'var(--text-main)',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--success)',
                    flexShrink: 0,
                  }}
                />
                {u.userId === userId ? 'You' : u.userId}
                {u.isHost && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--warning)',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                    }}
                  >
                    HOST
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
