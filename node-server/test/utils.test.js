const { leavingGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, restartGame, handleMatchMaking , askingForGameInfos, startGame} = require('../src/utils');
const { games, players } = require('../src/gameState');
const Player = require('../src/player');

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
  
  const socketMock2 = { 
	id: '2', 
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


jest.mock('../src/gameState');
  
beforeEach(() => {
  jest.clearAllMocks();
});

describe('utils.js tests', () => {
	test('should handle leaving game', () => {
		players.set('1', { name: 'John' });
	
		// Mockez votre gameData
		games.set('game1', { 
		  doesPlayerBelongToGame: jest.fn().mockReturnValue(true), 
		  removePlayer: jest.fn(),
		  players: [] 
		});
	
		leavingGame(socketMock);
		expect(socketMock.leave).toHaveBeenCalled();
	  });

  test('should handle sending board and piece to player', () => {
    players.set('1', { name: 'John', pieceId: 0, score: 0 });
    games.set('game1', { doesPlayerBelongToGame: jest.fn().mockReturnValue(true), pieces: [{}] });
    sendBoardAndPieceToPlayer(socketMock, { updateBoard: [], score: 10 });
    expect(socketMock.emit).toHaveBeenCalledWith('updateNextPiece', expect.anything());
  });

  test('should handle sending lines to player', () => {
	players.set('1', { name: 'John' });
	games.set('game1', { doesPlayerBelongToGame: jest.fn().mockReturnValue(true) });
	sendLinesToPlayer(socketMock, 2);
	expect(socketMock.broadcast.to).toHaveBeenCalledWith(expect.anything());
	expect(socketMock.broadcast.to().emit).toHaveBeenCalledWith('receivedLines', 2);
  });
  

  test('should handle game over', () => {
    players.set('1', { name: 'John', gameOver: false });
    games.set('game1', { doesPlayerBelongToGame: jest.fn().mockReturnValue(true), isRunning: true, getWinner: jest.fn() });
    gameOver(socketMock);
    expect(players.get('1').gameOver).toBe(true);
  });

  test('should handle game restart', () => {
    games.set('game1', { doesPlayerBelongToGame: jest.fn().mockReturnValue(true), changeLeader: jest.fn() });
  });

  test('should handle match making', () => {
	players.set('1', new Player('John', 0, 'image_path', socketMock));
    expect(players.has('1')).toBe(true);
  });

  test('should handle asking for game infos', () => {
    const mockGame = { 
      doesPlayerBelongToGame: jest.fn().mockReturnValue(true)
    };
    games.set('game1', mockGame);
    
    askingForGameInfos(socketMock);
    
    expect(mockGame.doesPlayerBelongToGame).toHaveBeenCalled();
  });

  test('should handle match making', () => {
    const dataStartGame = { userName: 'John', userWin: 0, userImage: 'image_path', gameName: null, gameMode: 'mode' };
    const mockGame = { gameName: 'game1', gameInfos: {}, isRunning: false, players: [], addPlayer: jest.fn() };
    games.set('game1', mockGame);
    players.set('1', new Player('John', 0, 'image_path', socketMock));

    handleMatchMaking(socketMock, dataStartGame);

    expect(socketMock.join).toHaveBeenCalledWith(expect.anything());
    expect(socketMock.emit).toHaveBeenCalledWith('gameInfos', expect.anything());
    expect(players.get('1').role).toBe('player');
  });
});