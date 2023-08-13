import React, { useState, useEffect } from 'react'; // Ajoutez useEffect
import { useDispatch } from 'react-redux'; // Importez useDispatch
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { socket } from '../socket';

const Menu = () => {
  const [gameName, setGameName] = useState('');
  const username = Cookies.get('username');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
	console.log('useEffect Menu');
	const gameInfo = {
		leader: true,
		players: ['player1', 'player2'],
		gameMode: 'Normal',
		gameName: 'Nostra',
		role: 'player',
	  };
  
	dispatch({ type: 'SET_GAME_INFO', payload: gameInfo });
	// console.log
    // socket.on('gameInfo', (data) => {
    //   dispatch({ type: 'SET_GAME_INFO', payload: data });
    // });

    return () => {
      socket.off('gameInfo');
    };
  }, [dispatch]);

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
          <Link className="button" onClick={() => handleLaunchGame('NORMAL')}>Normal</Link>
        </li>
        <li>
          <Link className="button" onClick={() => handleLaunchGame('INVISIBLE')}>Invisible</Link>
        </li>
        <li>
          <Link className="button" onClick={() => handleLaunchGame('RANDOMGRAVITY')}>Graviter Aléatoire</Link>
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


// import React from 'react';
// import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';

// const Menu = () => {
//   const username = Cookies.get('username');

//   return (
//     <div>
//       <div className="menu">
//         <li>
//           <Link className="button" to={`normal[${username}]`}>Normal</Link>
//         </li>
//         <li>
//           <Link className="button" to={`invisible[${username}]`}>Invisible</Link>
//         </li>
//         <li>
//           <Link className="button" to={`graviter[${username}]`}>Graviter Aléatoire</Link>
//         </li>
//       </div>
//     </div>
//   );
// };

// export default Menu;
