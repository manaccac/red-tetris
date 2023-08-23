import { socket } from './socket';
import Cookies from 'js-cookie';

export const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'INIT_SOCKET') {
    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
    });
  }

  switch (action.type) {
    case 'INIT_SOCKET_MENU':
	socket.on('gameInfos', (data) => {
		console.log('start');
		store.dispatch({ type: 'SET_GAME_INFO', payload: data });
		action.navigate(`${data.gameName}[${action.payload.username}]`);
		socket.off('lookingForAGame');
		socket.off('NoGameFound');
		socket.off('GameFull');
		socket.off('gameInfos');
	});

      socket.on('NoGameFound', () => {
        store.dispatch({ type: 'NO_GAME_FOUND' });
      });

      socket.on('GameFull', () => {
        store.dispatch({ type: 'GAME_FULL' });
      });
  }
  if (action.type === 'LOOKING_FOR_A_GAME')
  	socket.emit('lookingForAGame', { userName: action.payload.userName, userWin: action.payload.userWin, userImage: action.payload.userImage, gameMode: action.payload.gameMode, gameName: action.payload.gameName });
  if (action.type === 'USERNAME_REP')
	socket.on('usernameRep', action.payload.handleUsernameRep);
  if (action.type === 'EMIT_USER_INFO')
	socket.emit('setUserInfos', { username: action.payload.username, image: action.payload.selectedImageIndex });
  if (action.type === 'RESTART_GAME')
  socket.emit('restartGame', action.payload.username);

  if (action.type === 'INIT_SOCKET_GAME') {
	socket.on('gameInfos', (data) => {
		console.log('gameInfos received');
		store.dispatch({ type: 'SET_GAME_INFO', payload: data });
	});
	socket.on('gameStart', (response) => {
		console.log('gameStart received');
		action.props.resetGameState();
		action.setGameRunning(false);
		action.props.updatePiece([response.piece, response.nextPiece]);
		action.props.setOpponentName(response.opponentName);
	});
	socket.on('spectator', () => {
		console.log('spectator');
		action.props.setLeader(false);
		action.props.setSpectator(true);
	});
	socket.on('receivedLines', (numberOfLines) => {
		console.log('receivedLines');
		action.props.addIndestructibleLine(numberOfLines);
	});
	socket.on('Victory', () => {
		console.log('Victory : ', action.scoreUpdatedRef.current);
		// Récupérez la valeur actuelle du cookie de score
		const currentScore = action.parseInt(Cookies.get('score'), 10) || 0;
		// Incrémentez le score
		const newScore = currentScore + 1;
  
		// Mettez à jour le cookie de score avec la nouvelle valeur
		Cookies.set('score', newScore);
		action.props.updateScore(newScore);
		action.props.setIsVictory(true);
		action.setScoreUpdated(true);
	});
	socket.on('opponentBoardData', (opponentBoardData, userName, score) => {
		console.log('received in socketOnOpponent score: ' + score);
		action.props.updateOpponentBoard(userName, opponentBoardData, score);
	});
	socket.on('updateNextPiece', (nextPiece) => {
		console.log('updateNextPiece');
		action.props.updatePiece(nextPiece);
	});
	socket.on('playerWon', (playerWhoWon, winnerScore) => {
		console.log('playerWon');
		action.props.setPlayerWon(playerWhoWon, winnerScore);
	});
	socket.emit('askingGameInfos');
  }
  if (action.type === 'CLEANUP_SOCKET_GAME') {
	socket.emit('leftGame');
	socket.off('Victory');
	socket.off('receivedLines');
	socket.off('gameStart');
	socket.off('opponentBoardData');
	socket.off('updateNextPiece');
	socket.off('gameInfos');
	socket.off('spectator');
	socket.off('playerWon');
  }

  if (action.type === 'START_GAME') {
	socket.emit('startGame', action.props.gameName);
  }

  if (action.type === 'GAME_OVER') {
	socket.emit('gameOver');
}
if (action.type === 'UPDATE_BOARD_SOCKET') {
	const updatedBoardAndScore = { updateBoard: action.props.board, score: action.props.score };
	socket.emit('updateBoard', updatedBoardAndScore);
  }
if (action.type === 'SEND_LINES') {
	// socket.emit('sendLines', completedLines.length - 1);
	console.log('sendLines 	socket.emit(sendLines,  action.props.send');
	socket.emit('sendLines',  action.props.send );
}
  
  return next(action);
};
