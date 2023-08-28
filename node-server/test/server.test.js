const { Server } = require('socket.io');
const { createServer } = require('http');
const Client = require('socket.io-client');
const { io } = require('../server'); // Replace with the path to your server file

const { handleMatchMaking, restartGame, startGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, leavingGame } = require('../src/utils');

jest.mock('../src/utils'); // Mock auxiliary functions

let serverSocket;
let clientSocket;

beforeAll((done) => {
  const httpServer = createServer();
  serverSocket = new Server(httpServer);
  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket = new Client(`http://localhost:${port}`);
    io.attach(httpServer);
    clientSocket.on('connect', done);
  });
  serverSocket.on("connection", (socket) => {
	connectedSocket = socket;
	done();
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
});
describe("socket.io tests", () => {
	test("should set user infos", (done) => {
	  clientSocket.emit("setUserInfos", { username: "John", userWin: 0, imageId: 1 });
	  clientSocket.on("usernameRep", (isAvailable) => {
		expect(isAvailable).toBe(true);
		done();
	  });
	});
});

describe('socket.io additional tests', () => {
	test('should handle looking for a game', async () => {
		const dataStartGame = { gameType: 'multiplayer' };
		clientSocket.emit('lookingForAGame', dataStartGame);
		
		// Attendre un peu pour que l'événement soit traité
		await new Promise(resolve => setTimeout(resolve, 100));
		
		expect(handleMatchMaking).toHaveBeenCalledWith(expect.anything(), dataStartGame);
	  });
	  
	// Test pour vérifier le redémarrage d'un jeu
	test('should handle game restart', async () => {
	  clientSocket.emit('restartGame');

	  await new Promise(resolve => setTimeout(resolve, 100));

	  // Vérifiez si 'restartGame' a été appelé
	  expect(restartGame).toHaveBeenCalledWith(expect.anything());
	});

	// Test pour vérifier le démarrage d'un jeu
	test('should handle game start', async () => {
		const gameName = 'TestGame';
		clientSocket.emit('startGame', gameName);
		await new Promise(resolve => setTimeout(resolve, 100));
		expect(startGame).toHaveBeenCalledWith(expect.anything(), gameName);
	  });
  
	
	  // Test pour vérifier la mise à jour du tableau
	  test('should handle board update', async () => {
		const updatedBoardAndScore = { updateBoard: [[0, 1], [1, 0]], score: 10 };
		clientSocket.emit('updateBoard', updatedBoardAndScore);
		await new Promise(resolve => setTimeout(resolve, 100));
		expect(sendBoardAndPieceToPlayer).toHaveBeenCalledWith(expect.anything(), updatedBoardAndScore, expect.anything());
	  });
	
	  // Test pour vérifier l'envoi de lignes
	  test('should handle sending lines', async () => {
		const numberOfLines = 5;
		clientSocket.emit('sendLines', numberOfLines);
		await new Promise(resolve => setTimeout(resolve, 100));
		expect(sendLinesToPlayer).toHaveBeenCalledWith(expect.anything(), numberOfLines);
	  });
  
  });