import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    console.log('useEffect called');
    socket.on('gameInfos', (data) => {
      console.log('start');
      console.log(data);
      console.log('end');
      dispatch({ type: 'SET_GAME_INFO', payload: data });
      navigate(`${data.gameName}[${username}]`);
    });

    socket.on('NoGameFound', () => {
      alert('caca');
    });

    return () => {
      socket.off('gameInfos');
      socket.off('NoGameFound');
    };
  }, []);

  const handleLaunchGame = (mode) => {
    socket.emit('lookingForAGame', { userName: username, gameMode: mode, gameName: null });
  };

  const handleSearchGame = () => {
    socket.emit('lookingForAGame', { userName: username, gameMode: null, gameName: gameName });
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
