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
		console.log('Erreur lors du calcul du score :', error);
		return 0;
	}
}

export const generateNewPiece = () => {
	try {
		const pieceShapes = [
			{ shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 1 }, // Carré
			{ shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], id: 2 }, // Ligne
			{ shape: [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], id: 3 }, // T
			{ shape: [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], id: 4 }, // S
			{ shape: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 5 }, // Z
			{ shape: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]], id: 6 }, // L inverse
			{ shape: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], id: 7 }, // L
		];

		const newPiece = pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
		const position = { x: 4, y: -1 };

		return {
			shape: newPiece.shape,
			id: newPiece.id,
			position: position,
		};
	} catch (error) {
		console.log('Erreur lors de la génération d\'une nouvelle pièce :', error);
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
		console.log('Erreur lors de la rotation de la matrice :', error);
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
		console.log('Erreur lors de la vérification de la collision :', error);
		return true;
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
		console.log('Erreur lors de la création du plateau vide :', error);
		return [];
	}
};
