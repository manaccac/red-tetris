import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { socket } from '../socket';

function UsernamePrompt({ onUsernameSubmit }) {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleUsernameRep = (isAvailable) => {
      console.log('handleUsernameRepCalled');
      if (isAvailable) {
        Cookies.set('username', username);
        onUsernameSubmit(username);
      } else {
        setErrorMessage('Ce nom d\'utilisateur est déjà pris.');
      }
    };

    socket.on('usernameRep', handleUsernameRep);

    return () => {
      socket.off('usernameRep', handleUsernameRep);
    };
  }, [username, onUsernameSubmit]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    socket.emit('setUsername', username);
  };

  return (
    <form onSubmit={handleUsernameSubmit} data-testid="usernamePrompt">
      <label>
        Nom d'utilisateur:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <input type="submit" value="Envoyer" />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
}

export default UsernamePrompt;
