const { games, players, maxPlayerPerGame, io } = require('./gameState');
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

const leavingGame = (socket) => {
	leaveAllRooms(socket);
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			gameData.removePlayer(socket);
			if (gameData.players.length === 0) {
				games.delete(gameId);
				console.log('game is empty, deleting it');
			} else if (gameData.players.length === 1 && gameData.isRunning) {
				//On previent le client restant qu'il a gagné
				io.to(gameId).emit("Victory");
			} else {
				io.to(currentGame.gameName).emit('playerLost', players.get(socket.id).name);
			}
		}
	}
};

const sendBoardAndPieceToPlayer = (socket, dataBoard) => {
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			// si besoin on créé la nouvelle pièce dans la game
			if (gameData.pieces.length <= players.get(socket.id).pieceId) {
				gameData.pieces.push(generateNewPiece());
			}
			//on envoit la pièce suivante au joueur qui vient de poser
			socket.emit('updateNextPiece', [gameData.pieces[players.get(socket.id).pieceId]]);
			players.get(socket.id).pieceId++;
			//on envoit le board a l'adversaire
			socket.broadcast.to(gameId).emit('opponentBoardData', dataBoard, players.get(socket.id).name);
			return;
		}
	}
}

const sendLinesToPlayer = (socket, numberOfLines) => {
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			socket.broadcast.to(gameId).emit('receivedLines', numberOfLines);
			return
		}
	}
}

const gameOver = (socket) => {
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			players.get(socket.id).gameOver = true;
			// on prévient l'autre joueur de sa victoire
			socket.broadcast.to(gameId).emit('playerLost', players.get(socket.id).name);
			// si tous les joueurs ont perdus sauf un, il a gagné
			winner = gameData.getWinner(); // rempli si gagnant sinon null
			console.log('winnerName ?:' + winner.name);
			if (winner) {
				winner.socket.emit('Victory');
				io.to(gameId).emit('playerWon', winner.name);
			}
			return;
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
	console.log('matchmaking called');
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
				//tell everyone new comer but tell him he's spectator
				io.to(currentGame.gameName).emit('gameInfos', { ...currentGame.gameInfos });
				socket.emit('spectator');
			} else if (currentGame.players.length == maxPlayerPerGame) {// game pleine, on prévient
				socket.emit('GameFull');
			} else { // partie trouvée et places dispos, ajout à la salle d'attente
				socket.join(currentGame.gameName);
				currentGame.addPlayer(socket);
				// tell everyone new player
				io.to(currentGame.gameName).emit('gameInfos', { ...currentGame.gameInfos });
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
	io.to(currentGame.gameName).emit('gameStart', {
		piece: currentGame.pieces[0],
		nextPiece: currentGame.pieces[1],
		gameMode: currentGame.gameMode
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