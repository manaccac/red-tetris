import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import { socket } from '../src/socket';
import Cookies from 'js-cookie';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import gameReducer from './redux/reducer';

jest.mock('./App.css', () => ({}));

jest.mock('../src/socket', () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    connected: false,
  }
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const store = createStore(gameReducer);

  test('Renders UsernamePrompt when username is empty', () => {
	Cookies.get.mockReturnValue(undefined);
	const { getByTestId } = render(
	  <Provider store={store}>
		<App />
	  </Provider>
	);
	const usernamePrompt = getByTestId('usernamePrompt');
	expect(usernamePrompt).toBeInTheDocument();
  });
  test('Renders Home route when username is not empty', () => {
	Cookies.get.mockReturnValue('TestUser');
	const { getByText } = render(
	  <Provider store={store}>
		<App />
	  </Provider>
	);
	expect(getByText('RED-TETRIS')).toBeInTheDocument();
  });
  
  test('Calls onConnect when socket connects', () => {
	Cookies.get.mockReturnValue('TestUser');
	render(
	  <Provider store={store}>
		<App />
	  </Provider>
	);
  
	const connectCallback = socket.on.mock.calls.find(call => call[0] === 'connect')[1];
	connectCallback();
  });
  
  test('Calls onDisconnect when socket disconnects', () => {
	Cookies.get.mockReturnValue('TestUser');
	render(
	  <Provider store={store}>
		<App />
	  </Provider>
	);
  
	const disconnectCallback = socket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
	disconnectCallback();
  
	expect(socket.connected).toBe(false);
  });
  
});
