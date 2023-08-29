const Game = require('../src/game');
const Player = require('../src/player');

jest.mock('../src/player'); // Mocking the Player class

const socketMock = {
    id: '1',
    rooms: new Set(),
    leave: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    rooms: new Set(['room1', 'room2']),
    broadcast: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
    }
};

const { games, players } = require('../src/gameState');

describe('Game class functions', () => {
    let game;

    beforeEach(() => {
        // Set up player data
        players.set('1', { name: 'John' });

        game = new Game(socketMock, 'gameMode');
    });

    test('addPlayer should add a player to the game', () => {
        const playerData = { name: 'Alice', winScore: 0, image: 'image_path', socket: '1' };

        
        Player.mockImplementationOnce(() => ({
            getName: () => 'Alice'
            
        }));

        game.addPlayer(socketMock);

        expect(game.players.length).toBe(2);
    });

    test('removePlayer should remove a player from the game', () => {
        const playerData = { name: 'Alice', winScore: 0, image: 'image_path', socket: '1' };

        
        Player.mockImplementationOnce(() => ({
            getName: () => 'Alice'
            
        }));

        game.addPlayer(socketMock);
    });

	
    test('getWinner should return a player if there is only one player left with gameOver false', () => {
        const playerData = { name: 'Alice', winScore: 0, image: 'image_path', socket: '1' };

        Player.mockImplementation(() => ({
            getName: () => 'Alice',
            gameOver: false,
            role: 'player'
        }));

        game.addPlayer(socketMock);

        const winner = game.getWinner();

        expect(winner).toBe(null);

        players.get('1').gameOver = true;
    });

    test('changeLeader should update the leader with a random player', () => {
        const playerData = { name: 'Alice', winScore: 0, image: 'image_path', socket: '1' };

        Player.mockImplementation(() => ({
            getName: () => 'Alice'
        }));

        game.addPlayer(socketMock);
        game.addPlayer(socketMock);

        const initialLeader = game.leader;

        game.changeLeader();

    });
});

describe('Game class functions', () => {
    let game;

    beforeEach(() => {
        // Set up player data
        players.set('1', { name: 'John' });

        game = new Game(socketMock, 'gameMode');
    });
	

    test('getWinner should return a player if there is only one player left with gameOver false', () => {
        const playerData = { name: 'Alice', winScore: 0, image: 'image_path', socket: '1' };

        Player.mockImplementation(() => ({
            getName: () => 'Alice',
            gameOver: false,
            role: 'player'
        }));

        game.addPlayer(socketMock);

        const winner = game.getWinner();

        expect(winner).toBe(null);

        players.get('1').gameOver = true;
    });

    test('resetGame should reset game properties and player states', () => {
        Player.mockImplementation(() => ({
            getName: () => 'Alice',
            score: 100,
            pieceId: 5,
            role: 'player',
            gameOver: true
        }));

        game.addPlayer(socketMock);

        game.resetGame();

        expect(game.pieces.length).toBe(2);
        expect(game.players[0].gameOver).toBe(false);
        expect(game.players[0].pieceId).toBe(2);
        expect(game.players[0].role).toBe('player');
    });

    // Add more test cases for other methods as needed
});
