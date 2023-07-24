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
    const initialState = {};
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

	// it('should reset state when resetState action is dispatched', () => {
	// 	const initialState = store.getState();
	// 	store.dispatch(resetState());
	// 	expect(store.getState()).not.toEqual(initialState);  // ou tout autre assertion basée sur l'effet attendu de resetState
	//   });
	
	//   it('should add indestructible line when addIndestructibleLine action is dispatched', () => {
	// 	const lineIndex = 0;
	// 	const initialState = store.getState();
	// 	store.dispatch(addIndestructibleLine(lineIndex));
	// 	expect(store.getState()).not.toEqual(initialState);  // ou tout autre assertion basée sur l'effet attendu de addIndestructibleLine
	//   });
	
	//   it('should set victory status when setIsVictory action is dispatched', () => {
	// 	const victoryStatus = true;
	// 	const initialState = store.getState();
	// 	store.dispatch(setIsVictory(victoryStatus));
	// 	expect(store.getState()).not.toEqual(initialState);  // ou tout autre assertion basée sur l'effet attendu de setIsVictory
	//   });
});
