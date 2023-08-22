import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setMyName } from '../redux/actions';


const Menu = () => {
  const [gameName, setGameName] = useState('');
  const username = Cookies.get('username');
  const cookieImage = Cookies.get('image');
  const winscore = Cookies.get('score');

  const image = Cookies.get('image');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameNameFromReducer = useSelector(state => state.gameName);

  useEffect(() => {
	dispatch({
	  type: 'INIT_SOCKET_MENU',
	  payload: { username: username, winscore: winscore, cookieImage: cookieImage },
	  navigate: navigate
	});
  }, [dispatch, username, winscore, cookieImage, navigate]);

  const handleLaunchGame = (mode) => {
	dispatch({ type: 'LOOKING_FOR_A_GAME', payload: { userName: username, userWin: winscore, userImage: image, gameMode: mode, gameName: null } });
};

  const handleSearchGame = () => {
	dispatch({ type: 'LOOKING_FOR_A_GAME', payload: { userName: username, userWin: winscore, userImage: image, gameMode: null, gameName: gameName } });
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
