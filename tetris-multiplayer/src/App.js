import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import UsernamePrompt from './components/UsernamePrompt';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socket } from './socket';
import Cookies from 'js-cookie';
import './App.css';

console.log('username = ', Cookies.get('username'));
console.log('image = ', Cookies.get('image'));

export const UserInfo = ({ username, image, onProfileClick }) => {
	return (
	  <div className="user-info" onClick={onProfileClick}>
		<img src={`/user_pic/${image}-removebg-preview.png`} alt="Profile" className="profile-image" />
		<span className="username">{username}</span>
		<span className="score">
		  <img src="/crown.png" alt="Crown" className="crown-icon" />
		  1
		</span>
	  </div>
	);
  };
  
  function App() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [username, setUsername] = useState('');
	const [image, setImage] = useState('');
  
	useEffect(() => {
	  const cookieUsername = Cookies.get('username');
	  const cookieImage = Cookies.get('image');
	  if (cookieUsername) {
		setUsername(cookieUsername);
		setImage(cookieImage);
  
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
  
	const handleUsernameSubmit = (newUsername, newImage) => {
	  setUsername(newUsername);
	  setImage(newImage);
	};
  
	const handleProfileClick = () => {
	  setUsername('');
	  setImage('');
	};
  
	return (
	  <Router>
		<ToastContainer />
  
		{!username ? (
		  <UsernamePrompt onUsernameSubmit={handleUsernameSubmit} data-testid="usernamePrompt" />
		) : (
		  <>
			<UserInfo username={username} image={image} onProfileClick={handleProfileClick} />
			<Routes>
			  <Route path="/" element={<Home />} />
			  <Route path="/:hash" element={<Game />} />
			</Routes>
		  </>
		)}
	  </Router>
	);
  }
  
  export default App;
  