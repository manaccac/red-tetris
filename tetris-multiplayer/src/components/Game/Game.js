import React from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';
import Score from './Score';
import Piece from './Piece';

function Game() {
  let { room, player_name } = useParams();

  // Utilisez `room` et `player_name` dans votre logique de jeu

  return (
	<div className="game">
		<Score player="J1" />
		<Board />
		<Score player="J2" />
	</div>
  );
}

export default Game;
