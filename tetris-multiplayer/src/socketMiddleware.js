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
	});

      socket.on('NoGameFound', () => {
        store.dispatch({ type: 'NO_GAME_FOUND' });
      });

      socket.on('GameFull', () => {
        store.dispatch({ type: 'GAME_FULL' });
      });
  }
  if (action.type === 'LOOKING_FOR_A_GAME')
//   { userName: username, userWin: winscore, userImage: image, gameMode: mode, gameName: null }
  	  socket.emit('lookingForAGame', { userName: action.payload.userName, userWin: action.payload.userWin, userImage: action.payload.userImage, gameMode: action.payload.gameMode, gameName: action.payload.gameName });
	//   socket.emit('lookingForAGame', action.payload);

  if (action.type === 'USERNAME_REP')
	socket.on('usernameRep', action.payload.handleUsernameRep);
  if (action.type === 'EMIT_USER_INFO')
	socket.emit('setUserInfos', { username: action.payload.username, image: action.payload.selectedImageIndex });
  if (action.type === 'RESTART_GAME')
  socket.emit('restartGame', action.payload.username);

  
  return next(action);
};
