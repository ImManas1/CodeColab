import { useRoom } from '../context/RoomContext';

export default function FileExplorer({ isVisible, toggleVisibility }) {
  const { files, setFiles, activeFileId, setActiveFileId } = useRoom();

  const addNewFile = () => {
    const name = prompt("Enter new file name (e.g., script.py):");
    if (name) {
      const newFile = { id: Date.now(), name, content: "" };
      setFiles([...files, newFile]);
      setActiveFileId(newFile.id);
    }
  };

  const deleteFile = (e, id) => {
    e.stopPropagation(); // Prevent setting as active file
    if (confirm("Are you sure you want to delete this file?")) {
      const newFiles = files.filter(f => f.id !== id);
      setFiles(newFiles);
      if (activeFileId === id) {
        setActiveFileId(newFiles.length > 0 ? newFiles[0].id : null);
      }
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFiles(prev => {
          // Avoid duplicate files by path/name
          const fileName = file.webkitRelativePath || file.name;
          const exists = prev.find(f => f.name === fileName);
          if (exists) return prev;
          
          return [...prev, {
            id: Date.now() + Math.random(),
            name: fileName,
            content
          }];
        });
      };
      // For images/binary, this would corrupt, but for text files it's fine.
      reader.readAsText(file);
    });
    // Clear input so same file can be uploaded again if needed
    e.target.value = null;
  };

  if (!isVisible) {
    return (
      <div className="file-explorer-collapsed">
         <button className="icon-btn" onClick={toggleVisibility} title="Expand Explorer">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
         </button>
      </div>
    );
  }

  return (
    <aside className="file-explorer">
      <div className="panel-header" style={{ justifyContent: 'space-between', padding: '0 8px' }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button className="icon-btn" onClick={toggleVisibility} title="Collapse Explorer">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div className="panel-title" style={{ fontSize: '12px' }}>Project Files</div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {/* Upload Folder Button */}
          <label className="icon-btn" title="Upload Folder" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type="file" webkitdirectory="" directory="" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
          </label>
          {/* Upload File Button */}
          <label className="icon-btn" title="Upload Files" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
          </label>
          <button className="icon-btn" onClick={addNewFile} title="Add New File">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
      </div>
      <div className="file-tree" style={{ padding: '8px 4px' }}>
        {files.map(f => (
          <div 
            key={f.id} 
            className={`file-item ${f.id === activeFileId ? 'active' : ''}`}
            onClick={() => setActiveFileId(f.id)}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflow: 'hidden' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7, flexShrink: 0 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V4.5L18.5 9H13z"/>
              </svg>
              <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '13px' }}>
                {f.name}
              </span>
            </div>
            
            <button 
              className="icon-btn delete-btn" 
              onClick={(e) => deleteFile(e, f.id)}
              title="Delete File"
              style={{ width: '20px', height: '20px', opacity: f.id === activeFileId ? 1 : 0.5 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
        {files.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
            No files in project.
          </div>
        )}
      </div>
    </aside>
  );
}
