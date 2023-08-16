class Piece {
    shape;
    id;
    position;

    constructor() {
        console.log('piece consutrctor called');
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
		if (newPiece.id === 6 || newPiece.id === 7) {
			const position = { x: 4, y: -4 };
			this.position = position;
		}
		else if (newPiece.id === 2) {
			const position = { x: 4, y: -2 };
			this.position = position;
		}
		else{
			const position = { x: 4, y: -3 };
			this.position = position;
		}

        // const position = { x: 4, y: -1 };

        this.shape = newPiece.shape;
        this.id = newPiece.id;
        // this.position = position;
    }
}

module.exports = Piece;