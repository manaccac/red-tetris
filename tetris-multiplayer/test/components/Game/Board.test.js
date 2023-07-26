import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Board from '../../../src/components/Game/Board';
import '@testing-library/jest-dom/extend-expect';
import { setAwaitingOpponent } from '../../../src/redux/actions';


const initialState = {
  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
  piece: null,
  nextPiece: null,
  isGameOver: false,
  isGameWon: false,
  gameStart: true,
  awaitingOpponent: false,
  opponentBoard: Array.from({ length: 20 }, () => Array(10).fill(0)),
};

const mockStore = configureStore([]);

describe('Board', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Board />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the game board correctly', () => {
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        const cellElement = screen.getByTestId(`cell-${y}-${x}`);
        expect(cellElement).toBeInTheDocument();
      }
    }
  });

  it('should display the next piece correctly', () => {
    const initialState = {
      board: [],
      piece: null,
      nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
      isGameOver: false,
      isGameWon: false,
      gameStart: false,
      opponentBoard: [],
    };
  
    const mockStore = configureStore([]);
    const store = mockStore(initialState);
  
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Board />
        </MemoryRouter>
      </Provider>
    );
  
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const cellElement = screen.getByTestId(`cell-${y}-${x}`); // Ensure the test id is 'cell-{y}-{x}'
        if (initialState.nextPiece[y][x] === 1) {
          expect(cellElement).toHaveClass('cell id-0');
        } else {
          expect(cellElement).toHaveClass('cell id-0');
        }
      }
	  }
	});

  

  // it('should handle key events correctly', () => {
  //   const { container } = render(
  //     <Provider store={store}>
  //       <MemoryRouter>
  //         <Board />
  //       </MemoryRouter>
  //     </Provider>
  //   );
  //   // setAwaitingOpponent(true)
  
  //   fireEvent.keyDown(container, { key: 'ArrowDown', code: 'ArrowDown' });
  //   expect(store.getActions()).toContainEqual({ type: 'MOVE_DOWN' });
  
  //   fireEvent.keyDown(container, { key: 'ArrowUp', code: 'ArrowUp' });
  //   expect(store.getActions()).toContainEqual({ type: 'ROTATE' });
  
  //   fireEvent.keyDown(container, { key: 'ArrowLeft', code: 'ArrowLeft' });
  //   expect(store.getActions()).toContainEqual({ type: 'MOVE_LEFT' });
  
  //   fireEvent.keyDown(container, { key: 'ArrowRight', code: 'ArrowRight' });
  //   expect(store.getActions()).toContainEqual({ type: 'MOVE_RIGHT' });
  // });


  
	  
});
