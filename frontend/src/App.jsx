import { useState } from 'react';
import { RoomProvider } from './context/RoomContext';
import Room from './pages/Room';
import Home from './pages/Home';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <RoomProvider>
      {currentPage === 'home' ? (
        <Home onJoinRoom={() => setCurrentPage('room')} />
      ) : (
        <Room />
      )}
    </RoomProvider>
  );
}

export default App;