import { socket } from '../socket';
import {
	isCollision,
	rotateMatrix,
	calculateScore,
	generateNewPiece,
	createEmptyBoard,
} from './utils';

const initialState = {
	piece: null,
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

function gameReducer(state = initialState, action) {
	let piece;
	let newPosition;

	try {
		switch (action.type) {
			case 'MOVE_LEFT':
				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.x -= 1;
				if (!isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.position = newPosition;
				}
				action.resolve();
				return { ...state, piece };
			case 'MOVE_RIGHT':
				if (state.piece.position.x >= 7) {
					piece = { ...state.piece };
					newPosition = { ...piece.position };
					newPosition.x = 7;
					piece.position = newPosition;
					action.resolve();
					return { ...state, piece };
				}

				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.x += 1;
				if (!isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.position = newPosition;
				}
				action.resolve();
				return { ...state, piece };
			case 'ROTATE':
				piece = { ...state.piece };
				const rotatedShape = rotateMatrix(piece.shape);
				newPosition = { ...piece.position };
				piece.shape = rotatedShape;
				if (isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.shape = state.piece.shape;
				}
				action.resolve();
				return { ...state, piece };
			case 'MOVE_DOWN':
				if (state.isGameOver) {
					action.resolve();
					return state;
				}
				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.y += 1;
				if (isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					const updatedBoard = [...state.board];
					socket.emit('updateBoard', state.board);
					piece.shape.forEach((row, y) => {
						row.forEach((cell, x) => {
							if (cell !== 0) {
								const boardX = piece.position.x + x;
								const boardY = piece.position.y + y;
								updatedBoard[boardY][boardX] = piece.id;
							}
						});
					});
					if (piece.position.y < 0) {
						action.resolve();
						socket.emit('gameOver');
						return {
							...state,
							board: updatedBoard,
							isGameOver: true,
						};
					}
					const completedLines = [];
					updatedBoard.forEach((row, y) => {
						if (row.every((cell) => cell > 0)) {
							completedLines.push(y);
						}
					});
					if (completedLines.length > 0) {
						let completedLinesWithoutIndestructible = completedLines.filter(lineIndex => !updatedBoard[lineIndex].includes(-1));
						completedLinesWithoutIndestructible.reduce((acc, lineIndex) => {
							acc.splice(lineIndex, 1);
							acc.unshift(Array(10).fill(0));
							return acc;
						}, updatedBoard);
						const score = state.score + calculateScore(completedLinesWithoutIndestructible.length);
						if (completedLines.length > 1) {
							socket.emit('sendLines', completedLines.length - 1);
						}
						action.resolve();
						return {
							...state,
							board: updatedBoard,
							piece: state.nextPiece,
							// nextPiece: nextPiece,
							score: score,
							//   opponentBoard: updatedBoard,
						};
					}
					action.resolve();
					return {
						...state,
						board: updatedBoard,
						piece: state.nextPiece,
						// nextPiece: nextPiece,
						//   opponentBoard: updatedBoard,
					};
				}
				piece.position = newPosition;
				action.resolve();
				return { ...state, piece };
			case 'DROP_PIECE':
				let droppedPiece = { ...state.piece };
				let droppedPosition = { ...droppedPiece.position };
				while (!isCollision(droppedPiece, droppedPosition.x, droppedPosition.y + 1, state.board)) {
					droppedPosition.y += 1;
				}
				droppedPiece.position = droppedPosition;
				action.resolve();
				return { ...state, piece: droppedPiece };
			case 'UPDATE_PIECE':
				console.log('in UPDATE_PIECE');
				const pieces = action.payload;
				console.log(action.payload);
				if (pieces.length == 1) {
					return { ...state, nextPiece: action.payload[0] };
				} else if (pieces.length == 2) {
					return { ...state, piece: action.payload[0], nextPiece: action.payload[1] };
				}
				console.log('Error: Receiveid <1 or >2 pieces in update_piece');
				return { ...state };
			case 'UPDATE_BOARD':
				action.resolve();
				return { ...state, board: action.board };
			case 'RESET_STATE':
				action.resolve();
				return {
					...initialState,
					board: Array.from({ length: 20 }, () => Array(10).fill(0)),
					gameStart: false,
					isGameOver: false,
				};

			case 'ADD_INDESTRUCTIBLE_LINE':
				console.log('Adding indestructible lines...');
				let newBoard = [...state.board];
				for (let i = 0; i < action.x; i++) {
					newBoard.shift(); // remove the first line from the top
					newBoard.push(new Array(10).fill(-1)); // add an indestructible line at the bottom
				}
				action.resolve();
				console.log('board after indestructible line');
				console.log(newBoard);
				return {
					...state,
					board: newBoard,
				};
			case 'GAME_STARTED':
				return {
					...state,
					gameStart: action.payload,
				};
			case 'IS_VICTORY':
				return {
					...state,
					isGameWon: true,
					isGameOver: true,
				}
			case 'SET_OPPONENT_NAME':
				return {
					...state,
					opponentName: action.payload
				}
			case 'SET_AWAITING_OPPONENT':
				return {
					...state,
					awaitingOpponent: action.payload,
				};
			case 'UPDATE_OPPONENT_BOARD':
				return {
					...state,
					opponentBoard: action.payload,
				};
			default:
				return state;
		}
	} catch (error) {
		console.error('Erreur lors de la réduction du jeu :', error);
		return state;
	}
}

export default gameReducer;
