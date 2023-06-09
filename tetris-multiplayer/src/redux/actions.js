export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_RIGHT = 'MOVE_RIGHT';
export const ROTATE = 'ROTATE';
export const MOVE_DOWN = 'MOVE_DOWN';
export const DROP_PIECE = 'DROP_PIECE';
export const GENERATE_PIECE = 'GENERATE_PIECE';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const RESET_STATE = 'RESET_STATE';
export const ADD_INDESTRUCTIBLE_LINE = 'ADD_INDESTRUCTIBLE_LINE';


export function moveLeft(resolve) {
  return { type: MOVE_LEFT, resolve };
}

export function moveRight(resolve) {
  return { type: MOVE_RIGHT, resolve };
}

export function rotate(resolve) {
  return { type: ROTATE, resolve };
}

export function moveDown(resolve) {
  return { type: MOVE_DOWN, resolve };
}

export function dropPiece(resolve) {
  return { type: DROP_PIECE, resolve };
}

export function resetState(resolve) {
  return { type: RESET_STATE, resolve };
}

export function generatePiece() {
	return (dispatch) => {
	  return new Promise((resolve) => {
		dispatch({ type: GENERATE_PIECE, resolve });
	  });
	};
  }

export function updateBoard(board) {
  return { type: UPDATE_BOARD, board };
}

export function addIndestructibleLine(x, resolve) {
	return { type: ADD_INDESTRUCTIBLE_LINE, x, resolve };
  }