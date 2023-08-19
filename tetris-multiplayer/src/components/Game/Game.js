import {React, useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Board from './Board';

function Game(props) {
  return (
    <div className="game">
      {/* <Score player="J1" /> */}
      {<Board  updateScore={props.updateScore}/>}
      {/* <Score player="J2" /> */}
    </div>
  );
}

export default Game;
