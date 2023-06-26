import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import UsernamePrompt from './components/UsernamePrompt';
import { socket } from './socket';
import Cookies from 'js-cookie';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUsername] = useState('');
  console.log('username = ', username);

  useEffect(() => {
    const cookieUsername = Cookies.get('username');
    if (cookieUsername) {
      setUsername(cookieUsername);
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent() {
      console.log('wtf');
      console.log('previous = ');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <Router>
      {!username ? (
        <UsernamePrompt />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:hash" element={<Game />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
