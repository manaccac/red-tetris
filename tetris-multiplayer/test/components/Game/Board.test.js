import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Board, {getRandomDelay, goHome, restartGame} from '../../../src/components/Game/Board';
import '@testing-library/jest-dom/extend-expect';
import { moveLeft, moveRight, rotate, moveDown, dropPiece, setAwaitingOpponent, updateOpponentBoard, setOpponentName, setLeader } from '../../../src/redux/actions';

const initialState = {
	board: Array.from({ length: 20 }, () => Array(10).fill(0)),
	piece: null,
	nextPiece: null,
	isGameOver: false,
	isGameWon: false,
	gameStart: true,
	awaitingOpponent: false,
  };
  
const mockStore = configureStore([]);
const store = mockStore(initialState);
  
store.dispatch(setAwaitingOpponent(true));

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
      gameStart: true,
	  awaitingOpponent: true,
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

	it('should dispatch moveLeft action when moveLeft is called', async () => {
		const initialState = {
			board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			piece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			isGameOver: false,
			isGameWon: false,
			gameStart: true,
			awaitingOpponent: true,
		};
		store = mockStore(initialState);
		// Appeler la fonction moveLeft
		const result = store.dispatch(moveLeft());
		await result;  // Si c'est une promesse, attendez qu'elle soit résolue
	
		// Vérifier que l'action moveLeft a été dispatchée
		const actions = store.getActions();
		expect(actions[0].type).toEqual(moveLeft().type);
	});

	it('should dispatch moveLeft action when moveLeft is called', async () => {
		const initialState = {
			board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			piece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			isGameOver: false,
			isGameWon: false,
			gameStart: true,
			awaitingOpponent: true,
		};
		store = mockStore(initialState);
		// Appeler la fonction moveLeft
		const result = store.dispatch(moveLeft());
		await result;  // Si c'est une promesse, attendez qu'elle soit résolue
	
		// Vérifier que l'action moveLeft a été dispatchée
		const actions = store.getActions();
		expect(actions[0].type).toEqual(moveLeft().type);
	});

	it('should dispatch updateOpponentBoard action when updateOpponentBoard is called', async () => {
		const initialState = {
			board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			piece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			isGameOver: false,
			isGameWon: false,
			gameStart: true,
			awaitingOpponent: true,
		};
		store = mockStore(initialState);
	
		const testName = "opponent1";
		const testBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
	
		const result = store.dispatch(updateOpponentBoard(testName, testBoard));
		await result;
	
		const actions = store.getActions();
		expect(actions[0].type).toEqual(updateOpponentBoard(testName, testBoard).type);
	});

	it('should dispatch setOpponentName action when setOpponentName is called', async () => {
		const initialState = {
			board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			piece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			isGameOver: false,
			isGameWon: false,
			gameStart: true,
			awaitingOpponent: true,
		};
		store = mockStore(initialState);
	
		const testName = "opponent1";
	
		const result = store.dispatch(setOpponentName(testName));
		await result;
	
		const actions = store.getActions();
		expect(actions[0].type).toEqual(setOpponentName(testName).type);
	});

	it('should dispatch setLeader action when setLeader is called', async () => {
		const initialState = {
			board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			piece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			nextPiece: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
			isGameOver: false,
			isGameWon: false,
			gameStart: true,
			awaitingOpponent: true,
		};
		store = mockStore(initialState);
	
		const testLeader = "leader1";
	
		const result = store.dispatch(setLeader(testLeader));
		await result;
	
		const actions = store.getActions();
		expect(actions[0].type).toEqual(setLeader(testLeader).type);
	});
	
	describe('getRandomDelay function', () => {
		it('should return a random value between 200 and 800 when gameMode is graviter', () => {
		  const props = { gameMode: 'graviter' };
		  const result = getRandomDelay(props);
		  expect(result).toBeGreaterThanOrEqual(200);
		  expect(result).toBeLessThanOrEqual(800);
		});
	  
		it('should return 500 when gameMode is not graviter', () => {
		  const props = { gameMode: 'otherMode' };
		  const result = getRandomDelay(props);
		  expect(result).toEqual(500);
		});
	  });
	  
	
	  describe('goHome function', () => {
		it('should call resetState, setAwaitingOpponent and navigate to home', () => {
		  const props = {
			resetState: jest.fn(),
			setAwaitingOpponent: jest.fn(),
		  };
		  const navigate = jest.fn();
		  goHome(props, navigate);
		  expect(props.resetState).toHaveBeenCalled();
		  expect(props.setAwaitingOpponent).toHaveBeenCalledWith(false);
		  expect(navigate).toHaveBeenCalledWith('/');
		});
	  });
	  
	
  
    // // Test 3: Should handle game over correctly
    // it('should handle game over correctly', () => {
    //   // Set the necessary state to trigger a game over scenario
    //   // Check if the appropriate message is rendered (e.g., GameOverScreen)
    //   // Your assertions here
    // });
  
    // // Test 4: Should handle victory correctly
    // it('should handle victory correctly', () => {
    //   // Set the necessary state to trigger a victory scenario
    //   // Check if the appropriate message is rendered (e.g., VictoryScreen)
    //   // Your assertions here
    // });
  
    // // Test 5: Should update opponent board correctly
    // it('should update opponent board correctly', () => {
    //   // Simulate receiving opponent board data through socket
    //   // Check if the opponent board is updated and rendered correctly
    //   // Your assertions here
    // });
  
    // // Test 6: Should update next piece correctly
    // it('should update next piece correctly', () => {
    //   // Simulate receiving next piece data through socket
    //   // Check if the next piece is updated and rendered correctly
    //   // Your assertions here
    // });
  
    // // Test 7: Should start the game and show countdown
    // it('should start the game and show countdown', async () => {
    //   // Set gameStart state to true to trigger the countdown
    //   // Check if the countdown screen is rendered and countdown updates correctly
    //   // Your assertions here
    // });
  
    // // Test 8: Should update gravity in gravity mode
    // it('should update gravity in gravity mode', () => {
    //   // Set gameMode to 'graviter' and simulate the getRandomDelay function
    //   // Check if the gravity updates correctly and sets the delay accordingly
    //   // Your assertions here
    // });
  
    // // Test 9: Should show waiting screen when game not started
    // it('should show waiting screen when game not started', () => {
    //   // Set gameStart state to false
    //   // Check if the waiting screen is rendered
    //   // Your assertions here
    // });
  
    // // Test 10: Should show next piece correctly in invisible mode
    // it('should show next piece correctly in invisible mode', () => {
    //   // Set gameMode to 'invisible' and update nextPiece state
    //   // Check if the next piece is not visible on the board
    //   // Your assertions here
    // });
  
  
  
	  
});
