export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_RIGHT = 'MOVE_RIGHT';
export const ROTATE = 'ROTATE';
export const MOVE_DOWN = 'MOVE_DOWN';
export const DROP_PIECE = 'DROP_PIECE';
export const UPDATE_PIECE = 'UPDATE_PIECE';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const RESET_STATE = 'RESET_STATE';
export const ADD_INDESTRUCTIBLE_LINE = 'ADD_INDESTRUCTIBLE_LINE';
export const GAME_STARTED = 'GAME_STARTED';
export const SET_AWAITING_OPPONENT = 'SET_AWAITING_OPPONENT';
export const UPDATE_OPPONENT_BOARD = 'UPDATE_OPPONENT_BOARD';
export const IS_VICTORY = 'IS_VICTORY';
export const SET_OPPONENT_NAME = 'SET_OPPONENT_NAME';


export function moveLeft(resolve = () => {}) {
    return { type: MOVE_LEFT, resolve };
}

export function moveRight(resolve = () => {}) {
    return { type: MOVE_RIGHT, resolve };
}

export function rotate(resolve = () => {}) {
    return { type: ROTATE, resolve };
}

export function moveDown(resolve = () => {}) {
    return { type: MOVE_DOWN, resolve };
}

export function dropPiece(resolve = () => {}) {
    return { type: DROP_PIECE, resolve };
}

export function resetState(resolve) {
	return { type: RESET_STATE, resolve };
}

export function updateBoard(board) {
	return { type: UPDATE_BOARD, board };
}

export function addIndestructibleLine(x, resolve) {
	return { type: ADD_INDESTRUCTIBLE_LINE, x, resolve };
}

export function gameStarted(value) {
	return { type: GAME_STARTED, payload: value };
}

export function updatePiece(pieces) {
	return { type: UPDATE_PIECE, payload: pieces };
}

export const setAwaitingOpponent = (awaiting) => ({
	type: SET_AWAITING_OPPONENT,
	payload: awaiting,
});

export const updateOpponentBoard = (board) => ({
	type: UPDATE_OPPONENT_BOARD,
	payload: board,
});

export const setIsVictory = (status) => ({
	type: IS_VICTORY,
	payload: status
});

export const setOpponentName = (oppName) => ({
	type: SET_OPPONENT_NAME,
	payload: oppName
});