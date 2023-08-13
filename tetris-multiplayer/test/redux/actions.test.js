/** @jsxRuntime classic */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import gameReducer from '../../src/redux/reducer';

import { 
	RESET_STATE, 
	MOVE_LEFT, 
	MOVE_RIGHT, 
	ROTATE, 
	MOVE_DOWN, 
	DROP_PIECE, 
	UPDATE_PIECE,
	UPDATE_BOARD, 
	ADD_INDESTRUCTIBLE_LINE,
	GAME_STARTED,
	SET_AWAITING_OPPONENT,
	UPDATE_OPPONENT_BOARD,
	IS_VICTORY,
	SET_OPPONENT_NAME,
	resetState, 
	moveLeft, 
	moveRight, 
	rotate, 
	moveDown, 
	dropPiece, 
	updatePiece,
	updateBoard,
	addIndestructibleLine,
	gameStarted,
	setAwaitingOpponent,
	updateOpponentBoard,
	setIsVictory,
	setOpponentName
  } from '../../src/redux/actions';
  
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Actions', () => {
  let store;

  beforeEach(() => {
    // Create the mock store with initial state (if needed)
    const initialState = {
		board: Array.from({ length: 20 }, () => Array(10).fill(0)),
		piece: {shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], x: 4, y: -1},
		nextPiece: null,
		isGameOver: false,
		isGameWon: false,
		gameStart: false,
		opponentBoard: Array.from({ length: 20 }, () => Array(10).fill(0)),
	};
    store = mockStore(initialState);
  });

  it('should handle key events correctly', () => {
    // Dispatch les actions directement
    store.dispatch(moveLeft());
    store.dispatch(moveRight());
    store.dispatch(rotate());
    store.dispatch(moveDown());
    store.dispatch(dropPiece());

    // Vérifiez que les actions ont été dispatchées
    const actions = store.getActions();
    expect(actions).toContainEqual(moveLeft(expect.any(Function)));
    expect(actions).toContainEqual(moveRight(expect.any(Function)));
    expect(actions).toContainEqual(rotate(expect.any(Function)));
    expect(actions).toContainEqual(moveDown(expect.any(Function)));
    expect(actions).toContainEqual(dropPiece(expect.any(Function)));
	});

	it('should create an action to reset state', () => {
		const resolve = () => {};
		const expectedAction = {
		  type: RESET_STATE,
		  resolve,
		};
		expect(resetState(resolve)).toEqual(expectedAction);
	});
	
	it('should set victory status when setIsVictory action is dispatched', () => {
		const victoryStatus = true;
		store.dispatch(setIsVictory(victoryStatus));
	
		// Make sure the action is properly dispatched and handled in the reducer
		const actions = store.getActions();
		expect(actions).toEqual([{ type: 'IS_VICTORY', payload: true }]);
	
		// Ensure that the reducer updates the state correctly
		const newState = gameReducer(store.getState(), actions[0]);
		expect(newState.isGameOver).toEqual(true);
		expect(newState.isGameWon).toEqual(true);
	});

	it('should update the game piece and the next piece when updatePiece action is dispatched', () => {
		// Setup
		const oldPiece = store.getState().piece;
		const oldNextPiece = store.getState().nextPiece;
		const newPiece = {shape: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], x: 4, y: 7};
		const newNextPiece = {shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], x: 4, y: -1};
		
		// Dispatch action with two new pieces
		store.dispatch(updatePiece([newPiece, newNextPiece]));
	
		// Test
		const actions = store.getActions();
		expect(actions).toEqual([{ type: 'UPDATE_PIECE', payload: [newPiece, newNextPiece] }]);
		
		const newState = gameReducer(store.getState(), actions[0]);
		expect(newState.piece).not.toEqual(oldPiece);
		expect(newState.piece).toEqual(newPiece);
		expect(newState.nextPiece).not.toEqual(oldNextPiece);
		expect(newState.nextPiece).toEqual(newNextPiece);
	});
	
	it('should update the next game piece when updatePiece action is dispatched with one piece', () => {
		// Setup
		const oldNextPiece = store.getState().nextPiece;
		const newNextPiece = {shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], x: 4, y: -1};
		
		// Dispatch action with one new piece
		store.dispatch(updatePiece([newNextPiece]));
	
		// Test
		const actions = store.getActions();
		expect(actions).toEqual([{ type: 'UPDATE_PIECE', payload: [newNextPiece] }]);
		
		const newState = gameReducer(store.getState(), actions[0]);
		expect(newState.nextPiece).not.toEqual(oldNextPiece);
		expect(newState.nextPiece).toEqual(newNextPiece);
	});	
	
	it('should update the game board when updateBoard action is dispatched', () => {
		const newBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
		store.dispatch(updateBoard(newBoard));
	  
		const actions = store.getActions();
		expect(actions).toEqual([{ type: 'UPDATE_BOARD', board: newBoard }]);
	  
		const newState = gameReducer(store.getState(), actions[0]);
		expect(newState.board).toEqual(newBoard);
	  });

	it('should reset state when resetState action is dispatched', () => {
		// Dispatch the action to reset the state
		store.dispatch(resetState());
	
		// Ensure that the reducer updates the state correctly
		const newState = gameReducer(store.getState(), { type: 'RESET_STATE' });
	
		// Verify the fields that should be reset to the initial state
		expect(newState.board).toEqual(Array.from({ length: 20 }, () => Array(10).fill(0)));
		expect(newState.gameStart).toEqual(false);
		expect(newState.isGameOver).toEqual(false);
		// Add other assertions for other fields if needed
	});
	
	it('should add indestructible line when addIndestructibleLine action is dispatched', () => {
		//  envoie une ligne dou le 1
		store.dispatch(addIndestructibleLine(1));
		
		const actions = store.getActions();
		expect(actions.some((action) => action.type === 'ADD_INDESTRUCTIBLE_LINE')).toBe(true);
		
		const newState = actions.reduce((state, action) => gameReducer(state, action), store.getState());
		
		const lastRow = newState.board[newState.board.length - 1];
		expect(lastRow.every((cell) => cell === -1)).toBe(true);
	  });
	  
	  
});
