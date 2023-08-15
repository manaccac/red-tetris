import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  moveLeft, moveRight, rotate, moveDown, dropPiece, updatePiece,
  resetState, addIndestructibleLine, gameStarted, setAwaitingOpponent, updateOpponentBoard,
  setIsVictory, resetGameState, setOpponentName, setLeader, setMyName, setSpectator, setGameInfo, setPlayerWon
} from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import Cookies from 'js-cookie';
import OpponentBoard from './OpponentBoard';
import RenderNextPiece from './NextPiece';
import { WaitingScreen, CountdownScreen, GameOverScreen, VictoryScreen } from './Screens';

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
  opponentBoard: state.opponentBoard,
  opponentBoards: state.opponentBoards,
  opponentNames: state.opponentNames,
  leader: state.leader,
  opponents: state.opponents,
  gameMode: state.gameMode,
  gameName: state.gameName,
  myName: state.myName,
  isSpectator: state.isSpectator,
  playerWon: state.playerWon,
});

export function getRandomDelay(props) {
  if (props.gameMode === 'graviter') {
    let grav = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
    console.log('graviter mode = ' + grav);
    return grav;
  }
  else
    return 500;
}

export const goHome = (props, navigate) => {
  props.resetState();
  props.setAwaitingOpponent(false);
  navigate('/');
};

export const restartGame = async (props, setGameRunning, username) => {
  socket.emit('restartGame', username);
};


export const mapDispatchToProps = (dispatch) => ({
  moveLeft: () => new Promise((resolve) => dispatch(moveLeft(resolve))),
  moveRight: () => new Promise((resolve) => dispatch(moveRight(resolve))),
  rotate: () => new Promise((resolve) => dispatch(rotate(resolve))),
  moveDown: () => new Promise((resolve) => dispatch(moveDown(resolve))),
  dropPiece: () => new Promise((resolve) => dispatch(dropPiece(resolve))),
  updatePiece: (pieces) => dispatch(updatePiece(pieces)),
  gameStarted: (status) => dispatch(gameStarted(status)),
  addIndestructibleLine: (x) => new Promise((resolve) => dispatch(addIndestructibleLine(x, resolve))),
  resetState: () => new Promise((resolve) => dispatch(resetState(resolve))),
  setIsVictory: (status) => dispatch(setIsVictory(status)),
  setAwaitingOpponent: (awaiting) => dispatch(setAwaitingOpponent(awaiting)),
  updateOpponentBoard: (name, board) => dispatch(updateOpponentBoard(name, board)),
  setOpponentName: (oppName) => dispatch(setOpponentName(oppName)),
  setLeader: (leader) => dispatch(setLeader(leader)),
  setMyName: (myname) => dispatch(setMyName(myname)),
  setSpectator: (spectator) => dispatch(setSpectator(spectator)),
  setGameInfo: (gameInfos) => dispatch(setGameInfo(gameInfos)),
  setPlayerWon: (playerWon) => dispatch(setPlayerWon(playerWon)),
  resetGameState: () => dispatch(resetGameState()),
});

function Board(props) {

  //   const gameMode = props.gameMode;

  const username = Cookies.get('username');
  //   props.setMyName(username);


  let navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [gameRunning, setGameRunning] = useState(false);


  const handleRestartGame = () => {
    restartGame(props, setGameRunning, username);
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
      console.log('Erreur lors de la gestion de la touche enfoncée :', error);
    }
  };

  useEffect(() => {
    let countdownInterval;

    console.log('in countdown useeffect');
    console.log(props.gameStart);
    if (props.gameStart) {
      // console.log('gameStart is true, but countdown is: ')
      countdownInterval = setInterval(() => {
        console.log("hello count :", countdownInterval);
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            console.log('clearInterval got called');
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
  }, [props.gameStart, gameRunning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(async () => {
      try {
        if (!props.isGameOver && gameRunning) {
          await props.moveDown();
        }
      } catch (error) {
        console.log('Error while automatically moving down:', error);
      }
    }, getRandomDelay(props));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [props.isGameOver, gameRunning]);

  useEffect(() => {
    socket.on('gameInfos', (data) => {
      console.log('gameInfos received');
      props.setGameInfo(data);
    });
    socket.on('gameStart', (response) => {
      props.resetGameState();
      setGameRunning(false);
      props.updatePiece([response.piece, response.nextPiece]);
      props.setOpponentName(response.opponentName);
    });
    socket.on('spectator', () => {
      props.setLeader(false);
      props.setSpectator(true);
    });
    socket.on('receivedLines', (numberOfLines) => {
      props.addIndestructibleLine(numberOfLines);
    });
    socket.on('Victory', () => {
      props.setIsVictory(true);
    });
    socket.on('opponentBoardData', (opponentBoardData, userName) => {
      props.updateOpponentBoard(userName, opponentBoardData);
    })
    socket.on('updateNextPiece', (nextPiece) => {
      props.updatePiece(nextPiece);
    });
    socket.on('playerWon', (playerWhoWon) => {
      props.setPlayerWon(playerWhoWon);
    });
    socket.emit('askingGameInfos');
    // socket.emit('lookingForAGame', { userName: username, gameMode: props.gameMode, gameName: props.gameName });
    props.setAwaitingOpponent(true);
    return () => {
      socket.emit('leftGame');
      socket.off('Victory');
      socket.off('receivedLines');
      socket.off('gameStart');
      socket.off('opponentBoardData');
      socket.off('updateNextPiece');
      socket.off('gameInfos');
      socket.off('spectator');
      socket.off('playerWon');

      props.resetState();
      console.log('returned called');
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
        if (props.gameMode === 'invisible' && !isGameOver) {
          shouldShowPiece = false;
        }

        return (
          <div
            key={`${y}-${x}`}
            className={`cell ${(cell !== 0 || active) && shouldShowPiece ? 'filled' : ''
              } id-${cell !== 0 && shouldShowPiece ? cell : activePieceId}`}
            data-testid={`cell-${y}-${x}`}
          ></div>
        );
      })
    );

  const startGameHandler = () => {
    socket.emit('startGame', props.gameName);
    props.gameStarted(true);
  };

  return (

    <div
      className="game-container"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {!props.isSpectator && (
        <div className="board" data-testid="board-container">
          {renderCells()}
        </div>
      )}
      {(props.isSpectator) && (<h1>Spectateur</h1>)}


      {!props.isSpectator && (
        <RenderNextPiece />
      )}
      <OpponentBoard />
      <div className="opponent-name">
        {props.opponentName}
      </div>

      {props.isGameOver && (!props.isGameWon || props.isSpectator) && <GameOverScreen onGoHome={() => goHome(props, navigate)} onRestart={handleRestartGame} playerWon={props.playerWon} myName={props.myName} isLeader={props.leader} opponents={props.opponnents} />}
      {props.isGameOver && props.isGameWon && !props.isSpectator && <VictoryScreen onGoHome={() => goHome(props, navigate)} onRestart={handleRestartGame} playerWon={props.playerWon} myName={props.myName} isLeader={props.leader} />}
      {(!props.gameStart && !props.isSpectator) && (
        <WaitingScreen
          opponentNames={props.opponents}
          myName={props.myName}
          isLeader={props.leader}
          onStartGame={startGameHandler}
        />
      )}
      {!props.isGameOver && props.gameStart && !gameRunning && <CountdownScreen countdown={countdown} />}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
