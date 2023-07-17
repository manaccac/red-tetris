import {React, useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Board from './Board';

function Game() {
  let { hash } = useParams();
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);  // Initialisez gameMode avec useState

  useEffect(() => {
    console.log(hash);
    const hashPattern = /^(normal|invisible|graviter)\[[a-zA-Z0-9]+\]$/;
    if (!hashPattern.test(hash)) {
      console.log("hash invalide");
      console.log(hashPattern.test(hash));
      navigate("/");
    }
    else {
      setGameMode(hash.split("[")[0]);  // Utilisez setGameMode pour modifier gameMode
      console.log(gameMode);	
    }
  }, [hash, navigate]);
	  
  //   let { room, player_name } = useParams();

  // Utilisez `room` et `player_name` dans votre logique de jeu

  return (
    <div className="game">
      {/* <Score player="J1" /> */}
      {gameMode && <Board gameMode={gameMode} />}
      {/* <Score player="J2" /> */}
    </div>
  );
}

export default Game;
