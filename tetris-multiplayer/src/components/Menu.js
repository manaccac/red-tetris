import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Menu = () => {
  const username = Cookies.get('username');

  return (
    <div>
      <div className="menu">
        <li>
          <Link className="button" to={`normal[${username}]`}>Normal</Link>
        </li>
        <li>
          <Link className="button" to={`invisible[${username}]`}>Invisible</Link>
        </li>
        <li>
          <Link className="button" to={`graviter[${username}]`}>Graviter Aléatoire</Link>
        </li>
      </div>
    </div>
  );
};

export default Menu;


// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { socket } from '../../socket';

// const Menu = () => {
//   const username = Cookies.get('username');
//   const navigate = useNavigate(); // Utilisez useNavigate pour gérer la navigation

// const handleLaunchGame = (mode) => {
//     socket.emit('lookingForAGame', { userName: username, gameMode: mode, gameName: null });
// };


// const handleSearchGame = () => {
//     const gameMode = "YOUR_DEFAULT_GAMEMODE"; // Remplacez par le mode de jeu par défaut ou récupérez-le d'une autre manière
//     socket.emit('lookingForAGame', { userName: username, gameMode: gameMode, gameName: gameName });
// };

//   return (
//     <div>
//       <div className="menu">
{/* <li>
    <button onClick={() => handleLaunchGame('NORMAL')}>Normal</button>
</li>
<li>
    <button onClick={() => handleLaunchGame('INVISIBLE')}>Invisible</button>
</li>
<li>
    <button onClick={() => handleLaunchGame('RANDOMGRAVITY')}>Graviter Aléatoire</button>
</li> */}

//       </div>
//       <div>
//         <input 
//           type="text" 
//           value={gameName} 
//           onChange={(e) => setGameName(e.target.value)} 
//           placeholder="Rechercher une partie"
//         />
//         <button onClick={() => handleSearchGame(gameName)}>Rechercher</button>
//       </div>
//     </div>
//   );
// };

// export default Menu;
