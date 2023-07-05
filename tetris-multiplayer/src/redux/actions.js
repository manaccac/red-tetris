export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_RIGHT = 'MOVE_RIGHT';
export const ROTATE = 'ROTATE';
export const MOVE_DOWN = 'MOVE_DOWN';
export const DROP_PIECE = 'DROP_PIECE';
export const GENERATE_PIECE = 'GENERATE_PIECE';
export const UPDATE_BOARD = 'UPDATE_BOARD';

// Action creators
export function moveLeft() {
    return { type: MOVE_LEFT };
}

export function moveRight() {
    return { type: MOVE_RIGHT };
}

export function rotate() {
    return { type: ROTATE };
}

export function moveDown() {
    return { type: MOVE_DOWN };
}

export function dropPiece() {
    return { type: DROP_PIECE };
}

export function generatePiece(piece) {
    return { type: GENERATE_PIECE, piece };
}

export function updateBoard(board) {
    return { type: UPDATE_BOARD, board };
}
