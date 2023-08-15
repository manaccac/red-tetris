import { socket } from '../socket';
import {
	isCollision,
	rotateMatrix,
	calculateScore,
	// generateNewPiece,
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
	isGameWon: undefined,
	opponents: {},
	leader: null,//chef de partie
	role: null, //spectator, player
	gameName: null, // le hash
	gameMode: null, // normal, gravity, invisible
	myName: null,
	isSpectator: false,
};

function gameReducer(state = initialState, action) {
	let piece;
	let newPosition;

	try {
		switch (action.type) {
			case 'MOVE_LEFT':
				console.log("piece:", state.piece);
				console.log("position:", state.position);
				console.log("rotation:", state.rotation);
				console.log("board:", state.board);
				console.log("score:", state.score);
				console.log("isGameOver:", state.isGameOver);
				console.log("nextPiece:", state.nextPiece);
				console.log("gameStart:", state.gameStart);
				console.log("awaitingOpponent:", state.awaitingOpponent);
				console.log("isGameWon:", state.isGameWon);
				console.log("opponents:", state.opponents);
				console.log("leader:", state.leader);
				console.log("role:", state.role);
				console.log("gameName:", state.gameName);
				console.log("gameMode:", state.gameMode);
				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.x -= 1;
				if (!isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.position = newPosition;
				}
				//action.resolve();
				return { ...state, piece };
			case 'MOVE_RIGHT':
				if (state.piece.position.x >= 7) {
					piece = { ...state.piece };
					newPosition = { ...piece.position };
					newPosition.x = 7;
					piece.position = newPosition;
					//action.resolve();
					return { ...state, piece };
				}

				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.x += 1;
				if (!isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.position = newPosition;
				}
				//action.resolve();
				return { ...state, piece };
			case 'ROTATE':
				piece = { ...state.piece };
				const rotatedShape = rotateMatrix(piece.shape);
				newPosition = { ...piece.position };
				piece.shape = rotatedShape;
				if (isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					piece.shape = state.piece.shape;
				}
				//action.resolve();
				return { ...state, piece };
			case 'MOVE_DOWN':
				if (state.isGameOver) {
					//action.resolve();
					return state;
				}
				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.y += 1;
				if (isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					const updatedBoard = [...state.board];
					piece.shape.forEach((row, y) => {
						row.forEach((cell, x) => {
							if (cell !== 0) {
								const boardX = piece.position.x + x;
								const boardY = piece.position.y + y;
								updatedBoard[boardY][boardX] = piece.id;
							}
						});
					});
					socket.emit('updateBoard', updatedBoard, state.myName );
					if (piece.position.y < 0) {
						//action.resolve();
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
						//action.resolve();
						return {
							...state,
							board: updatedBoard,
							piece: state.nextPiece,
							// nextPiece: nextPiece,
							score: score,
							//   opponentBoard: updatedBoard,
						};
					}
					//action.resolve();
					return {
						...state,
						board: updatedBoard,
						piece: state.nextPiece,
						// nextPiece: nextPiece,
						//   opponentBoard: updatedBoard,
					};
				}
				piece.position = newPosition;
				//action.resolve();
				return { ...state, piece };
			case 'DROP_PIECE':
				let droppedPiece = { ...state.piece };
				let droppedPosition = { ...droppedPiece.position };
				while (!isCollision(droppedPiece, droppedPosition.x, droppedPosition.y + 1, state.board)) {
					droppedPosition.y += 1;
				}
				droppedPiece.position = droppedPosition;
				// //action.resolve();
				return { ...state, piece: droppedPiece };
			case 'UPDATE_PIECE':
				console.log('in UPDATE_PIECE');
				const pieces = action.payload;
				console.log(action.payload);
				if (pieces.length === 1) {
					return { ...state, nextPiece: action.payload[0] };
				} else if (pieces.length === 2) {
					return { ...state, piece: action.payload[0], nextPiece: action.payload[1] };
				}
				console.log('Error: Receiveid <1 or >2 pieces in update_piece');
				return { ...state };
			case 'UPDATE_BOARD':
				//action.resolve();
				return { ...state, board: action.board };
			case 'RESET_STATE':
				//action.resolve();
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
				const opponentName = action.payload;
				return {
				  ...state,
				  opponents: {
					...state.opponents,
					[opponentName]: {
					  ...state.opponents[opponentName],
					  name: opponentName,
					  board: [] // Initialiser le tableau du board de l'adversaire
					}
				  }
				};		
			case 'SET_AWAITING_OPPONENT':
				return {
					...state,
					awaitingOpponent: action.payload,
				};
			case 'UPDATE_OPPONENT_BOARD':
				const board_received = action.board;
				const name_received = action.name;
				// if (state.opponents[name_received]) {
				  return {
					...state,
					opponents: {
					  ...state.opponents,
					  [name_received]: {
						...state.opponents[name_received],
						board: board_received
					  }
					}
				  };
				// }
				// else {
				//   console.warn(`Trying to update non-existing opponent: ${name_received}`);
				//   return state;
				// }
				  
			case 'SET_LEADER':
				return {
					...state,
					leader: action.payload
				};
			case 'SET_GAME_INFO':
				// console.log("leader: " + state.leader)
				// Object.values(state.opponents).forEach(opponent => {
				// 	console.log("Opponent Name:", opponent.name);
				// 	console.log("Opponent Board:", opponent.board);
				// });
				// console.log("gameMode: " + state.gameMode)
				// console.log("gameName: " + state.gameName)
				// console.log("role: " + state.role)

				// console.log('Setting game info...');
				// console.log(action.payload);
				const { leader, players, gameMode, gameName, role } = action.payload;
				return {
				  ...state,
				  leader,
				  opponents: players.reduce((opponentsObj, playerName) => {
					opponentsObj[playerName] = {
					  name: playerName,
					  board: [],
					};
					return opponentsObj;
				  }, {}),
				  gameMode,
				  gameName,
				  role,
				};
			case 'SET_MY_NAME':
				return {
					...state,
					myName: action.payload,
				};
			case 'SET_SPECTATOR':
				return {
					...state,
					isSpectator: action.payload,
				};
				  
			default:
				return state;
		}
	} catch (error) {
		console.log('Erreur lors de la réduction du jeu :', error);
		return state;
	}
}

export default gameReducer;