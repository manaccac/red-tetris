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
// jest.mock('react-toastify/dist/ReactToastify.css', () => {});

jest.mock('../src/socket', () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    connected: false,
  }
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
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

});
