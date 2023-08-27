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
  
	test("should handle match making", (done) => {
	  serverSocket.on("connection", (socket) => {
		socket.on("lookingForAGame", () => {
		  expect(handleMatchMaking).toHaveBeenCalled();
		  done();
		});
	  });
	  clientSocket.emit("lookingForAGame", { gameData: "data" });
	});
  
	test("should handle restart game", (done) => {
	  serverSocket.on("connection", (socket) => {
		socket.on("restartGame", () => {
		  expect(restartGame).toHaveBeenCalled();
		  done();
		});
	  });
	  clientSocket.emit("restartGame");
	});
  
	test("should start game", (done) => {
	  serverSocket.on("connection", (socket) => {
		socket.on("startGame", () => {
		  expect(startGame).toHaveBeenCalled();
		  done();
		});
	  });
	  clientSocket.emit("startGame", "gameName");
	});
  
	test("should handle disconnect", (done) => {
	  serverSocket.on("connection", (socket) => {
		socket.on("disconnect", () => {
		  expect(leavingGame).toHaveBeenCalled();
		  done();
		});
	  });
	  clientSocket.close();
	});
});