import { socket } from './socket';

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
  }

  
  return next(action);
};
