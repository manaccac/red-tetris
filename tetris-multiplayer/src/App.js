import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import io from 'socket.io-client';
import './App.css';

function App() {

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      socket.emit('client connected', 'Hello server!');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:room/:player_name" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
