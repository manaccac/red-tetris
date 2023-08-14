import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Menu from '../../src/components/Menu';
import {socket} from '../../src/socket'; 

const initialState = {
  gameName: 'TestGame'
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GAME_INFO':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

jest.mock('../../src/socket', () => ({
	socket: {
	  emit: jest.fn(),
	  off: jest.fn(),
	}
  }));
  

afterEach(() => {
	jest.clearAllMocks();
});

const renderComponent = () => render(
	<Provider store={store}>
	  <MemoryRouter>
		<Menu />
	  </MemoryRouter>
	</Provider>
  );

  afterEach(() => {
	jest.clearAllMocks();
  });

const store = createStore(reducer);

describe('Menu Component', () => {
	it('should render buttons and input field', () => {
	  const { getByText, getByPlaceholderText } = render(
		<Provider store={store}>
		  <MemoryRouter>
			<Menu />
		  </MemoryRouter>
		</Provider>
	  );
  
	  expect(getByText('Normal')).toBeInTheDocument();
	  expect(getByText('Invisible')).toBeInTheDocument();
	  expect(getByText('Graviter Aléatoire')).toBeInTheDocument();
	  expect(getByPlaceholderText('Rechercher une partie')).toBeInTheDocument();
	});

  it('should update input value on change', () => {
    const { getByPlaceholderText } = render(
		<Provider store={store}>
		  <MemoryRouter>
			<Menu />
		  </MemoryRouter>
		</Provider>
    );

    const input = getByPlaceholderText('Rechercher une partie');
    fireEvent.change(input, { target: { value: 'NewGame' } });
    expect(input.value).toBe('NewGame');
  });

  // MUTE CAR POUR LE MOMENT ON RESTE SUR LE BOARD
//   it('should call handleLaunchGame with NORMAL mode when Normal button is clicked', () => {
//     const { getByText } = renderComponent();
//     fireEvent.click(getByText('Normal'));
//     expect(socket.emit).toHaveBeenCalledWith('lookingForAGame', expect.objectContaining({ gameMode: 'normal' }));
//   });

//   it('should call handleLaunchGame with INVISIBLE mode when Invisible button is clicked', () => {
//     const { getByText } = renderComponent();
//     fireEvent.click(getByText('Invisible'));
//     expect(socket.emit).toHaveBeenCalledWith('lookingForAGame', expect.objectContaining({ gameMode: 'invisible' }));
//   });

//   it('should call handleLaunchGame with RANDOMGRAVITY mode when Graviter Aléatoire button is clicked', () => {
//     const { getByText } = renderComponent();
//     fireEvent.click(getByText('Graviter Aléatoire'));
//     expect(socket.emit).toHaveBeenCalledWith('lookingForAGame', expect.objectContaining({ gameMode: 'graviter' }));
//   });

  it('should call handleSearchGame when Rechercher button is clicked', () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText('Rechercher'));
    expect(socket.emit).toHaveBeenCalledWith('lookingForAGame', expect.objectContaining({ gameName: expect.any(String) }));
  });
});
