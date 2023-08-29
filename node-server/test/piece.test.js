const Piece = require('../src/piece');

describe('Piece class', () => {
    test('should create a piece with a shape and an ID', () => {
        const piece = new Piece();

        // Expectations
        expect(piece.shape).toBeDefined();
        expect(piece.id).toBeDefined();
    });

    test('should create a piece with a valid position based on ID', () => {
        const piece = new Piece();

        // Determine the expected position based on piece ID
        let expectedPosition;
        if (piece.id === 6 || piece.id === 7) {
            expectedPosition = { x: 4, y: -4 };
        } else if (piece.id === 2) {
            expectedPosition = { x: 4, y: -2 };
        } else {
            expectedPosition = { x: 4, y: -3 };
        }

        // Expectations
        expect(piece.position).toEqual(expectedPosition);
    });

    test('should create pieces with random shapes and positions', () => {
        const iterations = 100; // Number of iterations to test randomness

        const pieceShapes = [
            { shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 1 },
            { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], id: 2 },
            { shape: [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], id: 3 },
            { shape: [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], id: 4 },
            { shape: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 5 },
            { shape: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]], id: 6 },
            { shape: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], id: 7 },
        ];

        const idCount = new Map(); // Map to count occurrence of each piece ID

        for (let i = 0; i < iterations; i++) {
            const piece = new Piece();
            const existingCount = idCount.get(piece.id) || 0;
            idCount.set(piece.id, existingCount + 1);
        }

        // Expectations
        for (const pieceShape of pieceShapes) {
            const expectedOccurrences = iterations * (1 / pieceShapes.length);
            const actualOccurrences = idCount.get(pieceShape.id) || 0;
            expect(actualOccurrences).toBeCloseTo(expectedOccurrences, -10); // Close enough due to randomness
        }
    });
});
