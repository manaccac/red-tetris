import React, { useState } from 'react';
import Cookies from 'js-cookie';

function UsernamePrompt() {
  const [username, setUsername] = useState('');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    Cookies.set('username', username);
    window.location.reload();
  };

  return (
    <form onSubmit={handleUsernameSubmit}>
      <label>
        Nom d'utilisateur:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <input type="submit" value="Envoyer" />
    </form>
  );
}

export default UsernamePrompt;
