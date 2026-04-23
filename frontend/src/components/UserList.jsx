import { useState } from 'react';

export default function UserList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Mock users
  const users = [
    { id: 1, name: 'You (Host)' },
    { id: 2, name: 'John Doe' }
  ];

  return (
    <div className="user-list-panel" style={{ padding: '16px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-glass)', flexShrink: 0 }}>
      <div 
        className="panel-title" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: isCollapsed ? '0' : '12px' }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>Online Users ({users.length})</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          style={{ 
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)'
          }}
        >
           <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
      
      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
               {u.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
