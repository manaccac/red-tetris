import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { socket } from '../socket';
import { toast } from 'react-toastify';
import ColorPicker from './ColorPicker';
import { getBlockColors } from './ColorPicker';
import { useDispatch } from 'react-redux';

function UsernamePrompt({ onUsernameSubmit }) {
  const initialUsername = Cookies.get('username') || '';
  const initialImageIndex = parseInt(Cookies.get('image'), 10) || 1;
  const [username, setUsername] = useState(initialUsername);
  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUsernameRep = (isAvailable) => {
      console.log('handleUsernameRepCalled');
      if (isAvailable || username === initialUsername) {
        Cookies.set('username', username);
        Cookies.set('image', selectedImageIndex);
        onUsernameSubmit(username, selectedImageIndex);
      } else {
        toast.error('Ce nom d\'utilisateur est déjà pris.', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
        });
      }
    };
	dispatch({ type: 'USERNAME_REP', payload: { handleUsernameRep } });
	return () => {
		dispatch({ type: 'socketoff_usernameRep'});
		socket.off('usernameRep');
	};
  }, [username, selectedImageIndex, onUsernameSubmit]);

  const handleUsernameSubmit = (e) => {
    console.log('handleUsernameSubmitCalled');
    e.preventDefault();

	dispatch({ type: 'EMIT_USER_INFO', payload: { username, selectedImageIndex } });
    console.log('emitting infos, imageId = ' + selectedImageIndex);
    // Store block colors in cookies
    const blockColors = getBlockColors();
    for (const [key, value] of Object.entries(blockColors)) {
      Cookies.set(key, value);
    }
  };


  return (
    <form onSubmit={handleUsernameSubmit} data-testid="usernamePrompt">
      <label className="username-label">
        Nom d'utilisateur:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <div className="image-selector">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((index) => (
          <img
            key={index}
            src={`/user_pic/${index}-removebg-preview.png`}
            alt={`Profile ${index}`}
            className={`profile-image ${selectedImageIndex === index ? 'selected' : ''}`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>

      <ColorPicker />

      <input type="submit" value="Envoyer" className="submit-button" />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );

}

export default UsernamePrompt;
