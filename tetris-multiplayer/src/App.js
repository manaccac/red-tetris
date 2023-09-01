import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import UsernamePrompt from './components/UsernamePrompt';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';

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
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const initialScore = parseInt(Cookies.get('score'), 10) || 0;
  const [score, setScore] = useState(initialScore);

  const dispatch = useDispatch();

  const [isSessionBlocked, setIsSessionBlocked] = useState(false);

  useEffect(() => {
    // Générer un identifiant unique pour cette session
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }

    // Vérifier si une autre session est active
    const activeSessionId = localStorage.getItem('activeSessionId');
    if (activeSessionId && activeSessionId !== sessionId) {
      setIsSessionBlocked(true);
      alert('Un onglet est déjà ouvert sur ce navigateur.');
    } else {
      localStorage.setItem('activeSessionId', sessionId);
    }

    // Écouter les changements dans localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'activeSessionId' && event.newValue !== sessionId) {
        setIsSessionBlocked(true);
        alert('Un onglet est déjà ouvert sur ce navigateur.');
      }
    });

    // Supprimer l'identifiant de session lors de la fermeture de l'onglet
    window.addEventListener('unload', () => {
      if (localStorage.getItem('activeSessionId') === sessionId) {
        localStorage.removeItem('activeSessionId');
      }
    });
  }, []);

  useEffect(() => {
    dispatch({ type: 'INIT_SOCKET' });
  }, [dispatch]);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  useEffect(() => {
    const cookieUsername = Cookies.get('username');
    const cookieImage = Cookies.get('image');
    if (cookieUsername) {
      setUsername(cookieUsername);
      setImage(cookieImage);
    }
  }, []);

  useEffect(() => {
    // Set block colors from cookies
    for (let i = 1; i <= 7; i++) {
      const color = Cookies.get(`block-color-${i}`);
      if (color) {
        document.documentElement.style.setProperty(`--block-color-${i}`, color);
      }
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
    <div style={{ pointerEvents: isSessionBlocked ? 'none' : 'auto' }}>

      <Router>
        <ToastContainer />
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
    </div>
  );
}

export default App;
