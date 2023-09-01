
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import gameReducer, { initialState } from '../../src/redux/reducer';
import { generateNewPiece, createEmptyBoard } from '../../src/redux/utils';



const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('gameReducer', () => {
  let store;

  beforeEach(() => {
	const stateWithPiece = {
		piece: generateNewPiece(),
		position: { x: 0, y: 0 },
		rotation: 0,
		board: createEmptyBoard(),
		score: 0,
		isGameOver: false,
		nextPiece: null,
		gameStart: false,
		awaitingOpponent: false,
		opponentBoard: createEmptyBoard(),
		isGameWon: undefined,
		opponentName: null,
	};
    store = mockStore(stateWithPiece);
  });

  it('should handle MOVE_LEFT correctly', () => {
    const initialPiece = store.getState().piece;
    store.dispatch({ type: 'MOVE_LEFT', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'MOVE_LEFT', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;

    expect(updatedPiece.position.x).toEqual(initialPiece.position.x - 1);
    expect(updatedPiece.position.x).toBeGreaterThanOrEqual(0);

    const board = newState.board;
    const shape = updatedPiece.shape;
    const x = updatedPiece.position.x;
    const y = updatedPiece.position.y;
    let isCollision = false;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          const boardX = x + cellIndex;
          const boardY = y + rowIndex;
          if (board[boardY] && board[boardY][boardX] !== 0) {
            isCollision = true;
          }
        }
      });
    });

    expect(isCollision).toBe(false);
  });


  it('should handle MOVE_RIGHT correctly', () => {
    const initialPiece = store.getState().piece;
    store.dispatch({ type: 'MOVE_RIGHT', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'MOVE_RIGHT', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;

    expect(updatedPiece.position.x).toEqual(initialPiece.position.x + 1);
    expect(updatedPiece.position.x).toBeLessThanOrEqual(7); // Assurez-vous que la pièce ne sort pas du board (x <= 7)

    const board = newState.board;
    const shape = updatedPiece.shape;
    const x = updatedPiece.position.x;
    const y = updatedPiece.position.y;
    let isCollision = false;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          const boardX = x + cellIndex;
          const boardY = y + rowIndex;
          if (board[boardY] && board[boardY][boardX] !== 0) {
            isCollision = true;
          }
        }
      });
    });

    expect(isCollision).toBe(false);
  });

  it('should handle ROTATE correctly', () => {
    const initialPiece = store.getState().piece;
    store.dispatch({ type: 'ROTATE', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'ROTATE', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;

    // Vérifier que la pièce a été tournée en modifiant sa forme
    expect(updatedPiece.shape).not.toEqual(initialPiece.shape);

    // Vérifier que la pièce ne sort pas du board en tournant (vérifier chaque cellule de la nouvelle forme)
    const board = newState.board;
    const shape = updatedPiece.shape;
    const x = updatedPiece.position.x;
    const y = updatedPiece.position.y;
    let isCollision = false;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          const boardX = x + cellIndex;
          const boardY = y + rowIndex;
          if (board[boardY] && board[boardY][boardX] !== 0) {
            isCollision = true;
          }
        }
      });
    });

    expect(isCollision).toBe(false);
  });

  it('should handle MOVE_DOWN correctly', () => {
    const initialPiece = store.getState().piece;
    store.dispatch({ type: 'MOVE_DOWN', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'MOVE_DOWN', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;

    // Vérifier que la pièce a été déplacée vers le bas (y augmenté de 1)
    expect(updatedPiece.position.y).toEqual(initialPiece.position.y + 1);

    // Vérifier que la pièce ne sort pas du board en se déplaçant vers le bas (vérifier chaque cellule de la nouvelle position)
    const board = newState.board;
    const shape = updatedPiece.shape;
    const x = updatedPiece.position.x;
    const y = updatedPiece.position.y;
    let isCollision = false;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          const boardX = x + cellIndex;
          const boardY = y + rowIndex;
          if (board[boardY] && board[boardY][boardX] !== 0) {
            isCollision = true;
          }
        }
      });
    });

    expect(isCollision).toBe(false);
  });


  it('should handle DROP_PIECE correctly', () => {
    const initialPiece = store.getState().piece;
    store.dispatch({ type: 'DROP_PIECE', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'DROP_PIECE', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;

    // Vérifier que la pièce a été déplacée vers la position la plus basse possible
    // (collision avec d'autres pièces ou avec le bas du plateau)
    expect(updatedPiece.position.y).toBeGreaterThanOrEqual(initialPiece.position.y);

    // Vérifier que la pièce ne sort pas du board en se déplaçant vers le bas
    expect(updatedPiece.position.y).toBeGreaterThanOrEqual(0);

    // Vérifier que la pièce ne se superpose pas à d'autres éléments du board
    const board = newState.board;
    const shape = updatedPiece.shape;
    const x = updatedPiece.position.x;
    const y = updatedPiece.position.y;
    let isCollision = false;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          const boardX = x + cellIndex;
          const boardY = y + rowIndex;
          if (board[boardY] && board[boardY][boardX] !== 0) {
            isCollision = true;
          }
        }
      });
    });

    expect(isCollision).toBe(false);
	});



  it('should handle UPDATE_PIECE correctly', () => {
    const oldPiece = store.getState().piece;
    const oldNextPiece = store.getState().nextPiece;

    const newPiece = generateNewPiece();
    const newNextPiece = generateNewPiece();

    store.dispatch({ type: 'UPDATE_PIECE', payload: [newPiece, newNextPiece] });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'UPDATE_PIECE', payload: [newPiece, newNextPiece] }]);

    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;
    const updatedNextPiece = newState.nextPiece;

    // Vérifier que la pièce a été mise à jour correctement
    expect(updatedPiece).not.toEqual(oldPiece);
    expect(updatedPiece).toEqual(newPiece);

    // Vérifier que la pièce suivante a été mise à jour correctement
    expect(updatedNextPiece).not.toEqual(oldNextPiece);
    expect(updatedNextPiece).toEqual(newNextPiece);
  });

  it('should handle UPDATE_BOARD correctly', () => {
    const newBoard = Array.from({ length: 20 }, () => Array(10).fill(0));

    store.dispatch({ type: 'UPDATE_BOARD', board: newBoard });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'UPDATE_BOARD', board: newBoard }]);

    const newState = gameReducer(store.getState(), actions[0]);

    // Vérifier que le board a été correctement mis à jour
    expect(newState.board).toEqual(newBoard);
  });

  it('should handle RESET_STATE correctly', () => {
    // Changer l'état initial pour le test
    const customInitialState = {
      ...initialState,
      board: Array.from({ length: 20 }, () => Array(10).fill(1)), // Remplir le board de 1 pour le test
      gameStart: true,
      isGameOver: true,
    };
	const customInitial = {
		piece: null,
		position: { x: 0, y: 0 },
		playerWhoWon: null,
		rotation: 0,
		board: createEmptyBoard(),
		score: 0,
		isGameOver: false,
		nextPiece: null,
		gameStart: false,
		awaitingOpponent: false,
		isGameWon: undefined,
		opponents: {},
		leader: null,//chef de partie
		role: null, //spectator, player
		gameName: null, // le hash
		gameMode: null, // normal, gravity, invisible
		send: 0,
		updateBoard: false,
		winnerScore: 0,
		myName: undefined,
		isSpectator: false,
    };

    store = mockStore(customInitialState);

    // Appeler l'action RESET_STATE
    store.dispatch({ type: 'RESET_STATE', resolve: () => {} });
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'RESET_STATE', resolve: expect.any(Function) }]);

    const newState = gameReducer(store.getState(), actions[0]);

    // Vérifier que l'état a été correctement réinitialisé
    expect(newState).toEqual(customInitial);

  });


  it('should handle GAME_STARTED correctly', () => {
    // First, set awaitingOpponent to true
    store.dispatch({ type: 'SET_AWAITING_OPPONENT', payload: true });
  
    // Then, dispatch the GAME_STARTED action with payload true
    store.dispatch({ type: 'GAME_STARTED', payload: true });
  
    // Check if the action SET_AWAITING_OPPONENT has been dispatched correctly
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_AWAITING_OPPONENT', payload: true },
      { type: 'GAME_STARTED', payload: true },
    ]);
  
    // Get the updated state after the actions are dispatched
    const newState = gameReducer(store.getState(), actions[1]);

    // Check if the state has been updated correctly
    expect(newState.awaitingOpponent).toEqual(false);
    expect(newState.gameStart).toEqual(true);
  });
  
  it('should handle MOVE_RIGHT correctly when already at the rightmost position', () => {
    // Set the initial state with piece positioned at the rightmost position (x = 7)
    const initialState = {
      piece: { shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], position: { x: 7, y: 0 } },
      // ... other state properties ...
    };
  
    // Create the mock store with the initial state
    const store = mockStore(initialState);
  
    // Dispatch the action MOVE_RIGHT
    store.dispatch({ type: 'MOVE_RIGHT', resolve: () => {} });
  
    // Check if the action MOVE_RIGHT has been dispatched correctly
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'MOVE_RIGHT', resolve: expect.any(Function) }]);
  
    // Get the updated state after the action is dispatched
    const newState = gameReducer(store.getState(), actions[0]);
    const updatedPiece = newState.piece;
  
    // Check if the piece has been moved to the rightmost position (x = 7)
    expect(updatedPiece.position.x).toEqual(7);
  
    // Check if the piece remains at the rightmost position even if MOVE_RIGHT is dispatched again
    store.dispatch({ type: 'MOVE_RIGHT', resolve: () => {} });
    const actionsAfterMoveAgain = store.getActions();
    const newStateAfterMoveAgain = gameReducer(newState, actionsAfterMoveAgain[0]);
    const updatedPieceAfterMoveAgain = newStateAfterMoveAgain.piece;
  
    expect(updatedPieceAfterMoveAgain.position.x).toEqual(7);
  });

  it('should handle ROTATE correctly when collision occurs', () => {
    // Set up the initial state with a collision in the rotated shape
    const initialState_rotate = {
      piece: { shape: [[0, 0, 1], [1, 1, 1]], position: { x: 0, y: 0 } },
      // ... other state properties ...
    };
  
    // Create the mock store with the initial state
    const store = mockStore(initialState_rotate);
  
    // Dispatch the action ROTATE
    store.dispatch({ type: 'ROTATE', resolve: () => {} });
  
    // Get the updated state after the action is dispatched
    const actions = store.getActions();
    const newState = gameReducer(store.getState(), actions[0]);
  
    // Check if the shape of the piece remains unchanged after the collision
    expect(newState.piece.shape).toEqual(initialState_rotate.piece.shape);
  });
  
  it('should handle MOVE_DOWN correctly when game is over', () => {
    // Set up the initial state with game over
    const initialState_move_down = {
      piece: { shape: [[1]], position: { x: 0, y: -1 } },
      isGameOver: true,
      // ... other state properties ...
    };
  
    // Create the mock store with the initial state
    const store = mockStore(initialState_move_down);
  
    // Dispatch the action MOVE_DOWN
    store.dispatch({ type: 'MOVE_DOWN', resolve: () => {} });
  
    // Get the updated state after the action is dispatched
    const actions = store.getActions();
    const newState = gameReducer(store.getState(), actions[0]);
  
    // Check if the state remains unchanged when the game is over
    expect(newState).toEqual(initialState_move_down);
  });
  
  it('should handle MOVE_DOWN correctly with collision', () => {
    // Set up the initial state with a piece that causes collision when moving down
    const initialState_moveD = {
      piece: {
        shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 
        id: 2,
        position: {
          x: 0,
          y: 9,
        }
      },
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      ],
    };
  
    // Create the mock store with the initial state
    const store = mockStore(initialState_moveD);
  
    // Dispatch the action MOVE_DOWN
    store.dispatch({ type: 'MOVE_DOWN', resolve: () => {} });
  
    // Get the updated state after the action is dispatched
    const actions = store.getActions();
    const newState = gameReducer(store.getState(), actions[0]);
  
    // Check if the piece position and the board are unchanged after the collision
    if (newState.piece) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(newState.piece.position.x).toEqual(initialState_moveD.piece.position.x);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(newState.piece.position.y).toEqual(initialState_moveD.piece.position.y + 1);  
      }
      expect(newState.board).toEqual(initialState_moveD.board);
  });

  

  it('should handle IS_VICTORY correctly', () => {
    // Écrire le test pour l'action IS_VICTORY ici
  });

  it('should handle SET_OPPONENT_NAME correctly', () => {
    // Écrire le test pour l'action SET_OPPONENT_NAME ici
  });

  it('should handle SET_AWAITING_OPPONENT correctly', () => {
    // Écrire le test pour l'action SET_AWAITING_OPPONENT ici
  });

  it('should handle UPDATE_OPPONENT_BOARD correctly', () => {
    // Écrire le test pour l'action UPDATE_OPPONENT_BOARD ici
  });
});
