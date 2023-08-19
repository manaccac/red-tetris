import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { socket } from '../socket';
import { setMyName } from '../redux/actions';
import { toast } from 'react-toastify';

const Menu = () => {
  const [gameName, setGameName] = useState('');
  const username = Cookies.get('username');
  const image = Cookies.get('image');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameNameFromReducer = useSelector(state => state.gameName);

  useEffect(() => {
    console.log('useEffect called');
    socket.on('gameInfos', (data) => {
      console.log('start');
      console.log(data);
      console.log('end');
      dispatch({ type: 'SET_GAME_INFO', payload: data });
      navigate(`${data.gameName}[${username}]`);
    });

    //WHILE DEBUG ONLY
    socket.emit('setUsername', username);

    socket.on('NoGameFound', () => {
		toast.error('No Game Found', {
			position: toast.POSITION.BOTTOM_RIGHT,
			autoClose: 5000,
		  });
	});

    socket.on('GameFull', () => {
		toast.error('Game Full', {
			position: toast.POSITION.BOTTOM_RIGHT,
			autoClose: 5000,
		  });
		  
    });

    return () => {
      socket.off('gameInfos');
      socket.off('NoGameFound');
      socket.off('GameFull');
    };
  }, []);

  const handleLaunchGame = (mode) => {
    socket.emit('lookingForAGame', { userName: username, gameMode: mode, gameName: null });
  };

  const handleSearchGame = () => {
    socket.emit('lookingForAGame', { userName: username, gameMode: null, gameName: gameName });
  };

  dispatch(setMyName(username));



  return (
	<div className="menu-container">
	  <div className="search-game">
		<h2>Recherche de partie</h2>
		<input
		  type="text"
		  value={gameName}
		  onChange={(e) => setGameName(e.target.value)}
		  placeholder="Rechercher une partie"
		/>
		<button onClick={() => handleSearchGame(gameName)}>Rechercher</button>
	  </div>
	  <div className="create-game">
		<h2>Créer une partie</h2>
		<div className="menu">
		  <li>
			<button className="button" onClick={() => handleLaunchGame('normal')}>Normal</button>
		  </li>
		  <li>
			<button className="button" onClick={() => handleLaunchGame('invisible')}>Invisible</button>
		  </li>
		  <li>
			<button className="button" onClick={() => handleLaunchGame('graviter')}>Graviter Aléatoire</button>
		  </li>
		</div>
	  </div>
	</div>  
  );
  
};

export default Menu;
