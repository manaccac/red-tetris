import React from 'react';
import Board from './Board';


function Game() {
//   let { room, player_name } = useParams();

  // Utilisez `room` et `player_name` dans votre logique de jeu

  return (
	<div className="game">
		{/* <Score player="J1" /> */}
		<Board />
		{/* <Score player="J2" /> */}
	</div>
  );
}

export default Game;
