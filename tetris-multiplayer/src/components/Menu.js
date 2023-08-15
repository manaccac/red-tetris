import React, { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { socket } from '../socket';

const Menu = () => {
  const [gameName, setGameName] = useState('');
  const username = Cookies.get('username');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameNameFromReducer = useSelector(state => state.gameName);


  useEffect(() => {
	console.log('useEffect Menu');
	const gameInfo = {
		leader: true,
		// players: ['player1', 'player2'],
		players: [],
		gameMode: 'normal',
		gameName: 'Nostra',
		role: 'player',
	  };
  
	dispatch({ type: 'SET_GAME_INFO', payload: gameInfo });

	// socket.on('gameInfo', (data) => {
    //   dispatch({ type: 'SET_GAME_INFO', payload: data });
    // });

    return () => {
      socket.off('gameInfo');
    };
  }, [dispatch]);

  const handleLaunchGame = (mode) => {
    // socket.emit('lookingForAGame', { userName: username, gameMode: mode, gameName: null });
    navigate(`${gameNameFromReducer}[${username}]`);
  };

  const handleSearchGame = () => {
    socket.emit('lookingForAGame', { userName: username, gameMode: null, gameName: gameName });
    navigate(`${gameName}[${username}]`);
  };



  return (
    <div>
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
      <div>
        <input 
          type="text" 
          value={gameName} 
          onChange={(e) => setGameName(e.target.value)} 
          placeholder="Rechercher une partie"
        />
        <button onClick={() => handleSearchGame(gameName)}>Rechercher</button>
      </div>
    </div>
  );
};

export default Menu;
