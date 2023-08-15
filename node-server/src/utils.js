const { games, players, maxPlayerPerGame } = require('./gameState');
const Player = require('./player');
const Game = require('./game');

const leaveAllRooms = (socket) => {
	const rooms = Object.keys(socket.rooms);

	rooms.forEach(room => {
		if (room !== socket.id) { // Ne quittez pas la room correspondant à l'ID de socket lui-même
			socket.leave(room);
		}
	});
};

const leavingGame = (socket, io, type) => {
	console.log('leavingGame called');
	leaveAllRooms(socket);
	for (const [gameId, gameData] of games.entries()) {
		const clients = gameData.clients;
		if (!clients) return;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			clients.splice(index, 1);
			games.set(gameId, { clients: clients, pieces: gameData.pieces });
			if (clients.length === 0) {
				games.delete(gameId);
				console.log('game is empty, deleting it');
			} else {
				//On previent le client restant qu'il a gagné
				io.to(gameId).emit("Victory");
			}
			console.log('socketId: ' + socket.id + ' left the game\n');
		}
	}
};

const sendBoardAndPieceToPlayer = (socket, dataBoard) => {
	console.log('client emetteur: ' + client.username)
	for (const [gameId, gameData] of games.entries()) {
		const clients = gameData.clients;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			// si besoin on créé la nouvelle pièce dans la game
			if (gameData.pieces.length <= socket.pieceId) {
				gameData.pieces.push(generateNewPiece());
			}
			//on envoit la pièce suivante au joueur qui vient de poser
			socket.emit('updateNextPiece', [gameData.pieces[socket.pieceId]]);
			socket.pieceId++;
			//on envoit le board a l'adversaire
			socket.broadcast.to(gameId).emit('opponentBoardData', dataBoard);
		}
	}
}

const sendLinesToPlayer = (socket, numberOfLines) => {
	for (const [gameId, gameData] of games.entries()) {
		const clients = gameData.clients;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			socket.broadcast.to(gameId).emit('receivedLines', numberOfLines);
		}
	}
}

const gameOver = (socket) => {
	for (const [gameId, gameData] of games.entries()) {
		const clients = gameData.clients;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			// on prévient l'autre joueur de sa victoire
			socket.broadcast.to(gameId).emit('Victory');
			console.log('after deleting, gamesleft : ' + games.size);
		}
	}
}

const restartGame = (socket, dataStartGame) => {
	if (!socket.username) { socket.username = dataStartGame.userName; }
	for (const [gameId, gameData] of games.entries()) {
		const clients = gameData.clients;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			if (clients.length == 2) {
				for (const client of clients) {
					client.pieceId = 0;
				}
				game = gameId;
				games.get(game).pieces = [];
				const players = games.get(game).clients;
				let piece = generateNewPiece();
				let nextPiece = generateNewPiece();
				// pas besoin de stocker les deux premères pieces dans la game, elles sont envoyées direct
				players[0].emit('gameStart', {
					isFirstPlayer: true,
					opponentName: players[1].username,
					piece: piece,
					nextPiece: nextPiece
				})
				players[1].emit('gameStart', {
					isFirstPlayer: false,
					opponentName: players[0].username,
					piece: piece,
					nextPiece: nextPiece
				})
				break;
			} else { //l'autre a quitté, on repart en matchmaking
				console.log('opponent left ?');
				games.delete(gameId);
				handleMatchMaking(socket, games, dataStartGame);
			}
		}
	}
}

const handleMatchMaking = (socket, dataStartGame) => {
	if (!players.has(socket.id)) { // si le joueur n'existe pas, création
		player = new Player(dataStartGame.userName, socket);
		players.set(socket.id, player);
	}

	if (!dataStartGame.gameName) { // pas de game renseignée, c'est donc une création de game{
		currentGame = new Game(socket, dataStartGame.gameMode);
		games.set(currentGame.gameName, currentGame);
		socket.join(currentGame.gameName);
		socket.emit('gameInfos', { ...currentGame.gameInfos, role: 'player' });
	} else { // nom renseigné, le joueur cherche une partie avec un nom spécifique
		currentGame = games.get(dataStartGame.gameName);
		if (currentGame) { // la partie existe
			if (currentGame.isRunning) {// game en cours, prevenir le client qu'il sera spectateur
				socket.join(currentGame.gameName);
				currentGame.addPlayer(socket);
				socket.emit('gameInfos', { ...currentGame.gameInfos, role: 'spectator' });
			} else if (currentGame.players.length == maxPlayerPerGame) {// game pleine, on prévient
				socket.emit('GameFull');
			} else { // partie trouvée et places dispos, ajout à la salle d'attente
				socket.join(currentGame.gameName);
				currentGame.addPlayer(socket);
				socket.emit('gameInfos', { ...currentGame.gameInfos, role: 'player' });
			}
		} else { // la partie n'existe pas, prévenir l'user et retour menu
			socket.emit('NoGameFound');
		}
	}
}

const startGame = (socket, gameName) => {
	currentGame = games.get(gameName);
	currentGame.players.forEach((player) => player.pieceId = 0);
	currentGame.isRunning = true
	players[0].emit('gameStart', {
		isFirstPlayer: true,
		opponentName: players[1].username,
		piece: piece,
		nextPiece: nextPiece,
		gameMode: game.gameMode
	})
	players[1].emit('gameStart', {
		isFirstPlayer: false,
		opponentName: players[0].username,
		piece: piece,
		nextPiece: nextPiece,
		gameMode: game.gameMode
	})
}

const generateNewPiece = () => {
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
		console.error('Erreur lors de la génération d\'une nouvelle pièce :', error);
		return null;
	}
};
// sending to all clients in 'game' game(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
module.exports = { startGame, restartGame, leavingGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking, generateNewPiece }