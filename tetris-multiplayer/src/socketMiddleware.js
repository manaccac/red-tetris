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
	  socket.emit('lookingForAGame', action.payload);

  if (action.type === 'USERNAME_REP')
	socket.on('usernameRep', action.payload.handleUsernameRep);
  if (action.type === 'EMIT_USER_INFO')
	socket.emit('setUserInfos', { username: action.payload.username, image: action.payload.selectedImageIndex });

  
  return next(action);
};
