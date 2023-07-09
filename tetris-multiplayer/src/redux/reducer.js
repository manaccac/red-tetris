import { addIndestructibleLine } from './actions';
import {
	isCollision,
	rotateMatrix,
	calculateScore,
	generateNewPiece,
	createEmptyBoard,
  } from './utils';
  
  const initialState = {
	piece: generateNewPiece(),
	position: { x: 0, y: 0 },
	rotation: 0,
	board: createEmptyBoard(),
	score: 0,
	isGameOver: false,
	nextPiece: generateNewPiece(),
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
		  if (state.piece.position.x >= 7){
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
			  return {
				...state,
				board: updatedBoard,
				isGameOver: true,
			  };
			}
			const completedLines = [];
			updatedBoard.forEach((row, y) => {
			  if (row.every((cell) => cell !== 0)) {
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
				const newPiece = state.nextPiece;
				const nextPiece = generateNewPiece();
				return {
				  ...state,
				  board: updatedBoard,
				  piece: newPiece,
				  nextPiece: nextPiece,
				  score: score,
				};
			  }
			  
			const newPiece = state.nextPiece;
			const nextPiece = generateNewPiece();
			action.resolve();
			return {
			  ...state,
			  board: updatedBoard,
			  piece: newPiece,
			  nextPiece: nextPiece,
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
		case 'GENERATE_PIECE':
		  if (state.isGameOver) {
			action.resolve();
			return null;
		  }
		const pieceShapes = [
			{shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 1}, // Carré
			{shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], id: 2}, // Ligne
			{shape: [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], id: 3}, // T
			{shape: [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], id: 4}, // S
			{shape: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 5}, // Z
			{shape: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]], id: 6}, // L inverse
			{shape: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], id: 7}, // L
		];
  

  
		  let shape = state.nextPiece ? state.nextPiece : pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
		  const position = { x: 4, y: 0 };
		  let generatedPiece = {
			shape: shape,
			id: shape.id,
			position: position,
		  };
		  let nextPiece = pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
		  if (isCollision(generatedPiece, position.x, position.y, state.board)) {
			console.log('Game Over. Restarting...');
			action.resolve();
			return {
			  ...state,
			  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
			  isGameOver: true,
			};
		  }
		  action.resolve();
		  return { ...state, nextPiece, piece: generatedPiece };
		case 'UPDATE_BOARD':
		  action.resolve();
		  return { ...state, board: action.board };
		case 'RESET_STATE':
			console.log('Game Over. Restarting...');
			action.resolve();
			return {
				piece: generateNewPiece(),
				position: { x: 0, y: 0 },
				rotation: 0,
				board: createEmptyBoard(),
				score: 0,
				isGameOver: false,
				nextPiece: generateNewPiece(),
			};
		case 'ADD_INDESTRUCTIBLE_LINE':
			console.log('Adding indestructible line...');
			let newBoard = [...state.board];
			newBoard.shift(); // remove the first line from the top
			newBoard.push(new Array(10).fill(-1)); // add an indestructible line at the bottom
			return {
			  ...state,
			  board: newBoard,
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
  