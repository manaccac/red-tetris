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
import ColorPicker from './components/ColorPicker';

console.log('username = ', Cookies.get('username'));
console.log('image = ', Cookies.get('image'));

export const UserInfo = ({ username, image, score, onProfileClick }) => {
  return (
    <div className="user-info" onClick={onProfileClick}>
      <img src={`/user_pic/${image}-removebg-preview.png`} alt="Profile" className="profile-image" />
      <span className="username">{username}</span>
      <span className="score">
        <img src="/crown.png" alt="Crown" className="crown-icon" />
        {score}
      </span>
    </div>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const initialScore = parseInt(Cookies.get('score'), 10) || 0;
  const [score, setScore] = useState(initialScore);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

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

  useEffect(() => {
    Cookies.set('score', score);
  }, [score]);

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

	  <ColorPicker />


      {!username ? (
        <UsernamePrompt onUsernameSubmit={handleUsernameSubmit} data-testid="usernamePrompt" />
      ) : (
        <>
          <UserInfo username={username} image={image} score={score} onProfileClick={handleProfileClick} />
          <Routes>
            <Route path="/" element={<Home />} />
			<Route path="/:hash" element={<Game updateScore={updateScore} />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
