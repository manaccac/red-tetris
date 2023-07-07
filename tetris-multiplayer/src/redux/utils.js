export function calculateScore(completedLines) {
	try {
	  if (completedLines === 1) {
		return 100;
	  } else if (completedLines === 2) {
		return 400;
	  } else if (completedLines === 3) {
		return 800;
	  } else if (completedLines === 4) {
		return 1600;
	  }
	  return 0;
	} catch (error) {
	  console.error('Erreur lors du calcul du score :', error);
	  return 0;
	}
  }
  
  export const generateNewPiece = () => {
	try {
	  const pieceShapes = [
		[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], // Carré
		[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // Ligne
		[[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], // T
		[[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], // S
		[[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], // Z
		[[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]], // L inverse
		[[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], // L
	  ];
  
	  const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
	  const position = { x: 4, y: -1 };
  
	  return {
		shape: shape,
		position: position,
	  };
	} catch (error) {
	  console.error('Erreur lors de la génération d\'une nouvelle pièce :', error);
	  return null;
	}
  };
  
  export function rotateMatrix(matrix) {
	try {
	  const rows = matrix.length;
	  const columns = matrix[0].length;
	  const rotatedMatrix = [];
	  for (let i = 0; i < columns; i++) {
		rotatedMatrix[i] = Array(rows);
		for (let j = 0; j < rows; j++) {
		  rotatedMatrix[i][j] = matrix[rows - j - 1][i];
		}
	  }
	  return rotatedMatrix;
	} catch (error) {
	  console.error('Erreur lors de la rotation de la matrice :', error);
	  return matrix;
	}
  };
  
  export function isCollision(piece, x, y, board) {
	try {
	  if (!board || !piece || y === -1) {
		if (x >= 9 || x <= 0)
		  return true;
		return false;
	  }
	  const shape = piece.shape;
	  const shapeHeight = shape.length;
	  const shapeWidth = shape[0].length;
  
	  for (let row = 0; row < shapeHeight; row++) {
		for (let col = 0; col < shapeWidth; col++) {
		  if (
			shape[row][col] !== 0 &&
			(y + row >= board.length ||
			  x + col < 0 ||
			  x + col >= board[0].length ||
			  board[y + row][x + col] !== 0)
		  ) {
			return true;
		  }
		}
	  }
  
	  return false;
	} catch (error) {
	  console.error('Erreur lors de la vérification de la collision :', error);
	  return false;
	}
  }
  
  export function createEmptyBoard() {
	try {
	  const board = [];
	  for (let row = 0; row < 20; row++) {
		board[row] = Array(10).fill(0);
	  }
	  return board;
	} catch (error) {
	  console.error('Erreur lors de la création du plateau vide :', error);
	  return [];
	}
  };
  