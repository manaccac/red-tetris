import { socket } from './socket';

export const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'INIT_SOCKET') {
    socket.on('connect', () => {
      store.dispatch({ type: 'SOCKET_CONNECTED' });
    });

    socket.on('disconnect', () => {
      store.dispatch({ type: 'SOCKET_DISCONNECTED' });
    });
  }

  return next(action);
};
