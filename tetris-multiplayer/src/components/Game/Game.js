import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Board from './Board';

function Game(props) {
  return (
    <div className="game">
      {<Board  updateScore={props.updateScore}/>}
    </div>
  );
}

export default Game;
