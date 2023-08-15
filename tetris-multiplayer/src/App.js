import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import UsernamePrompt from './components/UsernamePrompt';
import { socket } from './socket';
import Cookies from 'js-cookie';
import './App.css';

console.log('username = ', Cookies.get('username'));

function App() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [username, setUsername] = useState('');
  
	useEffect(() => {
	  const cookieUsername = Cookies.get('username');
	  if (cookieUsername) {
		setUsername(cookieUsername);
		  
		function onConnect() {
			setIsConnected(true);
		  }
	  
		  function onDisconnect() {
			setIsConnected(false);
		  }
	  
		  socket.on('connect', onConnect);
		  socket.on('disconnect', onDisconnect);
	  
		  return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		  };
	  }
	}, []);
  
	const handleUsernameSubmit = (newUsername) => {
	  setUsername(newUsername);
	};
  
	return (
	  <Router>
		{!username ? (
		  <UsernamePrompt onUsernameSubmit={handleUsernameSubmit} data-testid="usernamePrompt" />
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