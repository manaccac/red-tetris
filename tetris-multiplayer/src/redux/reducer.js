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
	playerWhoWon: null,
	winnerScore: 0,
	updateBoard: false,
	send: 0,
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
					return state;
				}
				piece = { ...state.piece };
				newPosition = { ...piece.position };
				newPosition.y += 1;
				if (isCollision(piece, newPosition.x, newPosition.y, state.board)) {
					if (piece.position.y < 0) {
						return {
							...state,
							// board: updatedBoard,
							isGameOver: true,
						};
					}
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
					const completedLines = [];
					updatedBoard.forEach((row, y) => {
						if (row.every((cell) => cell > 0)) {
							completedLines.push(y);
						}
					});
					if (completedLines.length > 0) {
						let send = 0;
						let completedLinesWithoutIndestructible = completedLines.filter(lineIndex => !updatedBoard[lineIndex].includes(-1));
						const score = state.score + calculateScore(completedLinesWithoutIndestructible.length);
						setTimeout(() => {
						  completedLinesWithoutIndestructible.reduce((acc, lineIndex) => {
							acc.splice(lineIndex, 1);
							acc.unshift(Array(10).fill(0));
							return acc;
						  }, updatedBoard);
						}, 500); // Ajoutez un délai de 500 ms avant de supprimer la ligne
						if (completedLines.length > 1) {
							send = completedLines.length - 1;
						}
					  
						return {
						  ...state,
						  send: send,
						  board: updatedBoard,
						  piece: state.nextPiece,
						  score: score,
						  updateBoard: true,
						};
					  }
					  
					return {
						...state,
						board: updatedBoard,
						piece: state.nextPiece,
						updateBoard: true,
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
				const pieces = action.payload;
				if (pieces.length === 1) {
					return { ...state, nextPiece: action.payload[0] };
				} else if (pieces.length === 2) {
					return { ...state, piece: action.payload[0], nextPiece: action.payload[1] };
				}
				return { ...state };
			case 'UPDATE_BOARD':
				//action.resolve();
				return { ...state, board: action.board };
			case 'RESET_STATE':
				//action.resolve();
				return {
					...initialState,
					myName: state.myName,
					board: Array.from({ length: 20 }, () => Array(10).fill(0)),
					// gameStart: false,
					// isGameOver: false,
					// role: undefined,
					// opponents: {},
					// gameMode: null,
					// gameName: null,
					// leader: null,
				};
			case 'RESET_GAME_STATE':
				return {
					...state,
					board: Array.from({ length: 20 }, () => Array(10).fill(0)),
					gameStart: true,
					isGameOver: false,
					isSpectator: false,
					isGameWon: false,
					role: 'player',
					score: 0,
					playerWhoWon: null
				};
			case 'ADD_INDESTRUCTIBLE_LINE':
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
			case 'SET_AWAITING_OPPONENT':
				return {
					...state,
					awaitingOpponent: action.payload,
				};
			case 'SET_OPPONENT_NAME':
				const opponentName = action.payload;
				if (opponentName === undefined) {
					return state;
				}
				if (opponentName !== state.myName) {
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
				}
				return state;

			case 'UPDATE_OPPONENT_BOARD':
				const board_received = action.board;
				const name_received = action.name;
				if (name_received === undefined) {
					console.warn(`Trying to update non-existing opponent: ${name_received}`);
					return state;
				}

				if (name_received !== state.myName) {
					return {
						...state,
						opponents: {
							...state.opponents,
							[name_received]: {
								...state.opponents[name_received],
								board: board_received,
								score: action.score
							}
						}
					};
				}
				return state;

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
				const { leader, players, gameMode, gameName, role, playersImage, playersWins } = action.payload;
				const opponents = {};
				players.forEach((playerName, index) => {
				  if (playerName !== state.myName) {
					opponents[playerName] = {
					  name: playerName,
					  board: [],
					  image: playersImage[index],
					  win: playersWins[index],
					  score: 0
					};
				  }
				});
				if (role === 'spectator') {
				  state.isSpectator = true;
				}
				return {
				  ...state,
				  leader,
				  opponents,
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
			case 'SET_PLAYER_WON':
				return {
					...state,
					playerWhoWon: action.playerWon,
					winnerScore: action.winnerScore
				}
			case 'UPDATE_BOARD_STATE':
				return {
					...state,
					updateBoard: false,
				};
			case 'SEND':
				return {
					...state,
					send: 0,
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
