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
	nextPiece : generateNewPiece(),
  };
  
  function gameReducer(state = initialState, action) {
	let piece;
	let newPosition;
  
	switch (action.type) {
	  case 'MOVE_LEFT':
		console.log('MOVE_LEFT position x: ' + state.piece.position.x + ' y: ' + state.piece.position.y);
		piece = { ...state.piece };
		newPosition = { ...piece.position };
		newPosition.x -= 1;
		if (!isCollision(piece, newPosition.x, newPosition.y, state.board)) {
			console.log("coliision")
		  piece.position = newPosition;
		}
		action.resolve();
		return { ...state, piece };
	  case 'MOVE_RIGHT':
		if (state.piece.position.y >= 9){
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
				updatedBoard[boardY][boardX] = cell;
			  }
			});
		  });
		  if (piece.position.y <= 0) {
			action.resolve();
			return { 
			  ...state, 
			  board: updatedBoard, 
			  isGameOver: true 
			};
		  }
		  const completedLines = [];
		  updatedBoard.forEach((row, y) => {
			if (row.every((cell) => cell !== 0)) {
			  completedLines.push(y);
			}
		  });
		  if (completedLines.length > 0) {
			completedLines.reduce((acc, lineIndex) => {
			  acc.splice(lineIndex, 1);
			  acc.unshift(Array(10).fill(0));
			  action.resolve();
			  return acc;
			}, updatedBoard);
			const score = state.score + calculateScore(completedLines.length);
			const newPiece = state.nextPiece;
		  const nextPiece = generateNewPiece();
		  action.resolve();
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
			nextPiece: nextPiece
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
		  [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], // Carré
		  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // Ligne
		  [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], // T
		  [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], // S
		  [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], // Z
		  [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0]], // L inverse
		  [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], // L
		];
		let shape = state.nextPiece ? state.nextPiece : pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
		const position = { x: 4, y: 0 };
		let generatedPiece = {
		  shape: shape,
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
	  default:
		return state;
	}
  }
  
  export default gameReducer;
  