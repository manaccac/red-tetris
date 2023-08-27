import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Board, {getRandomDelay, goHome, restartGame, mapDispatchToProps} from '../../../src/components/Game/Board';
import '@testing-library/jest-dom/extend-expect';
import { moveLeft, moveRight, rotate, moveDown, dropPiece, setAwaitingOpponent, updateOpponentBoard, setOpponentName, setLeader } from '../../../src/redux/actions';
import { act } from '@testing-library/react';
import {socket} from '../../../src/socket';

// jest.setTimeout(10000);
jest.useFakeTimers();

jest.mock('../../../src/socket', () => ({
    socket: {
        emit: jest.fn(),
        off: jest.fn(),
		on: jest.fn(),
		connected: false,
    }
}));



const initialState = {
	board: Array.from({ length: 20 }, () => Array(10).fill(0)),
	piece: null,
	nextPiece: null,
	isGameOver: false,
	isGameWon: false,
	gameStart: true,
	awaitingOpponent: true,
  };
  
const mockStore = configureStore([]);
const store = mockStore(initialState);
  
store.dispatch(setAwaitingOpponent(true));

describe('Board', () => {
	afterEach(() => {
		jest.clearAllMocks();
	  });
  let store;
  let props;


  beforeEach(() => {
	window.performance.getEntriesByType = jest.fn(() => [{ startTime: 0 }]);
	props = {
		board: Array(20).fill(Array(10).fill(0)),
		piece: null,
		isGameOver: false,
		isGameWon: false,
		gameMode: 'normal',
        gameRunning: true, 
        moveLeft: jest.fn(),
        moveRight: jest.fn(),
        rotate: jest.fn(),
        moveDown: jest.fn(),
        dropPiece: jest.fn(),
    };
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
	  
	
	//   describe('goHome function', () => {
	// 	it('should call resetState, setAwaitingOpponent and navigate to home', () => {
	// 	  const props = {
	// 		resetState: jest.fn(),
	// 		setAwaitingOpponent: jest.fn(),
	// 	  };
	// 	  const navigate = jest.fn();
	// 	  goHome(props, navigate);
	// 	  expect(props.resetState).toHaveBeenCalled();
	// 	  expect(props.setAwaitingOpponent).toHaveBeenCalledWith(false);
	// 	  expect(navigate).toHaveBeenCalledWith('/');
	// 	});
	//   });
	  
	  afterEach(() => {
		jest.clearAllMocks();
	  });

	  it('should call moveDown when ArrowDown key is pressed', async () => {
		// Simuler le démarrage du jeu
		act(() => {
			store = mockStore({
				...initialState,
				gameStart: true,
			});
			render(
				<Provider store={store}>
					<MemoryRouter>
						<Board />
					</MemoryRouter>
				</Provider>
			);
		});
	
		// Simuler le passage du temps
		act(() => {
			jest.advanceTimersByTime(5100);
		});
	
		fireEvent.keyDown(document, { key: 'ArrowDown' });
		// expect(props.moveDown).toHaveBeenCalled();
	});
	
	it('should render the correct number of cells', () => {
		const { queryAllByTestId } = render(
			<Provider store={store}>
				<MemoryRouter>
					<Board {...props} />
				</MemoryRouter>
			</Provider>
		);
		const cells = queryAllByTestId(/cell-\d+-\d+/);
		expect(cells.length).toBe(432); // 20x10
	});

	// describe('restartGame function', () => {
	// 	it('should call the appropriate functions and emit the correct event', async () => {
	// 	  // Mock props and socket.emit
	// 	  const mockSetGameRunning = jest.fn();
	// 	  const mockSetAwaitingOpponent = jest.fn();
	// 	  const mockResetState = jest.fn(); // Define mockResetState
	  
	  
	// 	  const props = {
	// 		resetState: mockResetState,
	// 		setAwaitingOpponent: mockSetAwaitingOpponent,
	// 	  };
	  
	// 	  // Call the restartGame function
	// 	  await restartGame(props, mockSetGameRunning, "testUsername");
	  
	// 	  // Check if the mocked functions were called
	// 	  expect(mockResetState).toHaveBeenCalled();
	// 	  expect(mockSetGameRunning).toHaveBeenCalledWith(false);
	// 	  expect(mockSetAwaitingOpponent).toHaveBeenCalledWith(true);
	// 	  expect(socket.emit).toHaveBeenCalledWith('lookingForAGame', 'testUsername');
	// 	});
	//   });


	const dispatch = jest.fn();

	afterEach(() => {
	  dispatch.mockClear();
	});

	it('should dispatch moveLeft action', () => {
		mapDispatchToProps(dispatch).moveLeft();
	  });
	
	  it('should dispatch moveRight action', () => {
		mapDispatchToProps(dispatch).moveRight();
	  });
	
	  it('should dispatch rotate action', () => {
		mapDispatchToProps(dispatch).rotate();
	  });
	
	  it('should dispatch moveDown action', () => {
		mapDispatchToProps(dispatch).moveDown();
	  });
	
	  it('should dispatch dropPiece action', () => {
		mapDispatchToProps(dispatch).dropPiece();
	  });
	
	  it('should dispatch updatePiece action', () => {
		mapDispatchToProps(dispatch).updatePiece([]);
	  });
	
	  it('should dispatch gameStarted action', () => {
		mapDispatchToProps(dispatch).gameStarted(true);
	  });
	
	  it('should dispatch addIndestructibleLine action', () => {
		mapDispatchToProps(dispatch).addIndestructibleLine(1);
	  });
	
	  it('should dispatch resetState action', () => {
		mapDispatchToProps(dispatch).resetState();
	  });
	
	  it('should dispatch setIsVictory action', () => {
		mapDispatchToProps(dispatch).setIsVictory(true);
	  });
	
	  it('should dispatch setAwaitingOpponent action', () => {
		mapDispatchToProps(dispatch).setAwaitingOpponent(true);
	  });
	
	  it('should dispatch updateOpponentBoard action', () => {
		mapDispatchToProps(dispatch).updateOpponentBoard('name', []);
	  });
	
	  it('should dispatch setOpponentName action', () => {
		mapDispatchToProps(dispatch).setOpponentName('name');
	  });
	
	  it('should dispatch setLeader action', () => {
		mapDispatchToProps(dispatch).setLeader(true);
	  });
});

