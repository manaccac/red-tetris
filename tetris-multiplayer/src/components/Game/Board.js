import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  moveLeft, moveRight, rotate, moveDown, dropPiece, updatePiece,
  resetState, addIndestructibleLine, gameStarted, setAwaitingOpponent, updateOpponentBoard, setIsVictory, setOpponentName
} from '../../redux/actions';
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

function VictoryScreen({ onGoHome, onRestart }) {
  return (
    <div className="overlay">
      <div className="message">
        <h1>Victoire !</h1>
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
  isGameWon: state.isGameWon,
  gameStart: state.gameStart,
  opponentBoard: state.opponentBoard
});

const mapDispatchToProps = (dispatch) => ({
  moveLeft: () => new Promise((resolve) => dispatch(moveLeft(resolve))),
  moveRight: () => new Promise((resolve) => dispatch(moveRight(resolve))),
  rotate: () => new Promise((resolve) => dispatch(rotate(resolve))),
  moveDown: () => new Promise((resolve) => dispatch(moveDown(resolve))),
  dropPiece: () => new Promise((resolve) => dispatch(dropPiece(resolve))),
  //pieces est un array, si size 2, alors init les deux pieces, si size 1 alors init nextPiece
  updatePiece: (pieces) => dispatch(updatePiece(pieces)),
  gameStarted: (status) => dispatch(gameStarted(status)),
  addIndestructibleLine: (x) => new Promise((resolve) => dispatch(addIndestructibleLine(x, resolve))),
  resetState: () => new Promise((resolve) => dispatch(resetState(resolve))),
  setIsVictory: (status) => dispatch(setIsVictory(status)),
  setAwaitingOpponent: (awaiting) => dispatch(setAwaitingOpponent(awaiting)),
  updateOpponentBoard: (board) => dispatch(updateOpponentBoard(board)),
  setOpponentName: (oppName) => dispatch(setOpponentName(oppName)),
});

function Board(props) {
  const [gravity, setGravity] = useState(500); // Valeur par défaut pour la gravité

  const gameMode = props.gameMode;

  const username = Cookies.get('username');

  let navigate = useNavigate();
  const [countdown, setCountdown] = useState(1);
  const [gameRunning, setGameRunning] = useState(false);


  function getRandomDelay() {
    if (gameMode === 'graviter') {
      let grav = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
      console.log('graviter mode = ' + grav);
      setGravity(grav); // Met à jour la valeur de gravité à chaque descente de pièce
      return grav;
    }
    else
      return 500;
  }

  const goHome = () => {
    props.resetState();
    props.setAwaitingOpponent(false);
    navigate('/');
  };
  const restartGame = async () => {
    console.log('restart game function called');
    setGameRunning(false);
    await props.resetState();
    // await props.generatePiece();
    await props.setAwaitingOpponent(true);

    console.log('going to emit soon');
    socket.emit('lookingForAGame', username);
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
    }, getRandomDelay());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [props.isGameOver, gameRunning, props.board]);

  useEffect(() => {
    socket.on('gameStart', (response) => {
      props.gameStarted(true);
      if (response.isFirstPlayer) console.log('im first player'); else console.log('im second player');
      props.setOpponentName(response.opponentName);
    });
    socket.on('receivedLines', (numberOfLines) => {
      props.addIndestructibleLine(numberOfLines);
    });
    socket.on('Victory', () => {
      props.setIsVictory(true);
    });
    socket.on('opponentBoardData', (opponentBoardData) => {
      props.updateOpponentBoard(opponentBoardData);
    })
    socket.on('updateNextPiece', (nextPiece) => {
      console.log('nextPiece received from server');
      console.log(nextPiece);
      props.updatePiece(nextPiece);
    });

    socket.emit('lookingForAGame', { userName: username, gameMode: gameMode });
    props.setAwaitingOpponent(true);
    return () => {
      socket.emit('leftGame');
      socket.off('Victory');
      socket.off('receivedLines');
      socket.off('gameStart');
      socket.off('opponentBoardData');

      props.resetState();
      props.gameStarted(false);
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

        const isGameOver = props.isGameOver && !props.isGameWon;
        let shouldShowPiece = true;
        if (gameMode === 'invisible' && !isGameOver) {
          shouldShowPiece = false;
        }

        return (
          <div
            key={`${y}-${x}`}
            className={`cell ${(cell !== 0 || active) && shouldShowPiece ? 'filled' : ''
              } id-${cell !== 0 ? cell && shouldShowPiece : activePieceId}`}
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

  const renderOpponentBoard = () => {
    // console.log(props.opponentBoard);
    if (props.opponentBoard && Array.isArray(props.opponentBoard) && props.opponentBoard.length > 0) {
      //   console.log('opponentBOard:');
      //   console.log(props.opponentBoard);
      return props.opponentBoard.flatMap((row, y) =>
        row.map((cell, x) => (
          <div
            key={`cell-${y}-${x}`}
            className={`opponent-board-cell ${cell !== 0 ? 'filled' : ''}`}
          ></div>
        ))
      );
    } else {
      return null;
    }
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
      <div className="opponent-board">
        {renderOpponentBoard()}
      </div>
      <div className="opponent-name">
        {props.opponentName}
      </div>

      {props.isGameOver && !props.isGameWon && <GameOverScreen onGoHome={goHome} onRestart={restartGame} />}
      {props.isGameOver && props.isGameWon && <VictoryScreen onGoHome={goHome} onRestart={restartGame} />}
      {!props.isGameOver && !props.gameStart && <WaitingScreen />}
      {!props.isGameOver && props.gameStart && !gameRunning && (
        <CountdownScreen countdown={countdown} />)}
    </div>


  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
