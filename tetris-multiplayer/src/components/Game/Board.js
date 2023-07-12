import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { moveLeft, moveRight, rotate, moveDown, dropPiece, generatePiece,
	resetState, addIndestructibleLine, gameStarted, setAwaitingOpponent, updateOpponentBoard } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import Cookies from 'js-cookie';

function WaitingScreen() {
  return (
    <div className="overlay">
      <div className="message">
        <h1>En attente d'un adversaire...</h1>
        <div className="loading-animation"></div>
      </div>
    </div>
  );
}

function CountdownScreen({ countdown }) {
  return (
    <div className="overlay">
      <div className="message">
        <h1>Le jeu commence dans...</h1>
        <div className="countdown">{countdown}</div>
      </div>
    </div>
  );
}

function GameOverScreen({ onGoHome, onRestart }) {
  return (
    <div className="overlay">
      <div className="message">
        <h1>Partie terminée</h1>
        <button onClick={onGoHome}>Retour à la page d'accueil.</button>
        <button onClick={onRestart}>Recommencer</button>
      </div>
    </div>
  );
}


const lastMove = {
  ArrowLeft: 0,
  ArrowRight: 0,
  ArrowUp: 0,
  ArrowDown: 0,
  " ": 0,
};

const delay = 40; // Délai entre chaque déplacement


const mapStateToProps = (state) => ({
	board: state.board,
	piece: state.piece,
	nextPiece: state.nextPiece,
	isGameOver: state.isGameOver,
	gameStart: state.gameStart,
  });
  
  const mapDispatchToProps = (dispatch) => ({
	moveLeft: () => new Promise((resolve) => dispatch(moveLeft(resolve))),
	moveRight: () => new Promise((resolve) => dispatch(moveRight(resolve))),
	rotate: () => new Promise((resolve) => dispatch(rotate(resolve))),
	moveDown: () => new Promise((resolve) => dispatch(moveDown(resolve))),
	dropPiece: () => new Promise((resolve) => dispatch(dropPiece(resolve))),
	generatePiece: () => new Promise((resolve) => dispatch(generatePiece(resolve))),
	addIndestructibleLine: (x) => new Promise((resolve) => dispatch(addIndestructibleLine(x, resolve))),
	resetState: () => new Promise((resolve) => dispatch(resetState(resolve))),
	gameStarted: () => dispatch(gameStarted()),
	setAwaitingOpponent: (awaiting) => dispatch(setAwaitingOpponent(awaiting)),
	updateOpponentBoard: (board) => dispatch(updateOpponentBoard(board)),
  });

function Board(props) {
  const username = Cookies.get('username');

  let navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [gameRunning, setGameRunning] = useState(false);



  const goHome = () => {
	props.resetState();
	props.setAwaitingOpponent(false);
    navigate('/');
  };
  const restartGame = () => {
	props.resetState().then(() => {
	  props.generatePiece();
	  props.setAwaitingOpponent(false);
	});
  };
  

  const handleKeyDown = async (event) => {
    try {
	  if (!gameRunning) return;

      if (props.isGameOver || Date.now() - lastMove[event.key] < delay) {
        return;
      }
      lastMove[event.key] = Date.now();

      switch (event.key) {
        case "ArrowLeft":
          await props.moveLeft();
          break;
        case "ArrowRight":
          await props.moveRight();
          break;
        case "ArrowUp":
          await props.rotate();
          break;
        case "ArrowDown":
          await props.moveDown();
          break;
        case " ":
		  await props.addIndestructibleLine(1);
          await props.dropPiece();

          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la touche enfoncée :', error);
    }
  };

  useEffect(() => {
    let countdownInterval;
  
    if (props.gameStart) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            setGameRunning(true);
            return 5;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000); 
    } else {
      setGameRunning(false);
    }
  
    return () => {
      clearInterval(countdownInterval);
    };
  }, [props.gameStart]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(async () => {
      try {
        if (!props.isGameOver && gameRunning) {
          await props.moveDown();
        }
      } catch (error) {
        console.error('Error while automatically moving down:', error);
      }
    }, 500);

	socket.on('opponentBoardData', (opponentBoardData) => {
		props.updateOpponentBoard(opponentBoardData);
	}); // ici a mettre le board

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [props.isGameOver, gameRunning]);

  useEffect(() => {
	socket.on('gameStart', () => props.gameStarted());
	socket.emit('lookingForAGame', username);
  
	props.setAwaitingOpponent(true);
  
	return () => {
	  socket.off('gameStart', () => props.gameStarted());
	};
  }, []);
  
  
  

  const renderCells = () =>
  props.board.map((row, y) =>
    row.map((cell, x) => {
      let active = false;
      let activePieceId = 0;
      if (props.piece) {
        active =
          props.piece.position.y <= y &&
          y < props.piece.position.y + props.piece.shape.length &&
          props.piece.position.x <= x &&
          x < props.piece.position.x + props.piece.shape[0].length &&
          props.piece.shape[y - props.piece.position.y][x - props.piece.position.x];
        if (active) {
          activePieceId = props.piece.id;
        }
      }

      return (
        <div
          key={`${y}-${x}`}
          className={`cell ${cell !== 0 || active ? 'filled' : ''} id-${cell !== 0 ? cell : activePieceId}`}
        ></div>
      );
    })
  );


  const renderNextPiece = () => {
    const boardw = Array.from({ length: 4 }, () => Array(4).fill(0));

    try {
      if (props.nextPiece.shape && Array.isArray(props.nextPiece.shape) && props.nextPiece.shape.length > 0) {
        const offsetX = Math.floor((boardw[0].length - props.nextPiece.shape[0].length) / 2);
        const offsetY = Math.floor((boardw.length - props.nextPiece.shape.length) / 2);

        props.nextPiece.shape.forEach((row, rowIndex) => {
          row.forEach((value, colIndex) => {
            if (value !== 0) {
              boardw[rowIndex + offsetY][colIndex + offsetX] = value;
            }
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors du rendu de la pièce suivante :', error);
    }

    return boardw.map((row, y) => (
      <div key={`row-${y}`} className="next-piece-row">
        {row.map((cell, x) => (
          <div
            key={`cell-${y}-${x}`}
            className={`next-piece-cell ${cell !== 0 ? 'filled' : ''}`}
          ></div>
        ))}
      </div>
    ));
  };

  return (
    <div
      className="game-container"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div className="board">
        {renderCells()}
      </div>
      <div className="next-piece">
        {renderNextPiece()}
      </div>
      {props.isGameOver && <GameOverScreen onGoHome={goHome} onRestart={restartGame} />}
      {!props.isGameOver && !props.gameStart && <WaitingScreen />}
      {!props.isGameOver && props.gameStart && !gameRunning && (
        <CountdownScreen countdown={countdown} />)}
	</div>		


  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
