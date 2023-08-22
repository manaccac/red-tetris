const { games, players, maxPlayerPerGame, io } = require('./gameState');
const Player = require('./player');
const Game = require('./game');
const Piece = require('./piece');

const leaveAllRooms = (socket) => {
	const rooms = socket.rooms;

	rooms.forEach(room => {
		if (room !== socket.id) { // Ne quittez pas la room correspondant à l'ID de socket lui-même
			socket.leave(room);
			console.log('leaving a room ?????????????');
		}
	});
};

const leavingGame = (socket) => {
	console.log('leavingGame');
	leaveAllRooms(socket);
	if (!players.has(socket.id)) return;
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			if (players.get(socket.id).role !== 'spectator') {
				gameOver(socket);
			}
			gameData.removePlayer(socket);
			if (gameData.players.length === 0) {
				games.delete(gameId);
			} else {
				if (gameData.leader == players.get(socket.id).name) {// si le leaver est leader, alors change leader
					gameData.changeLeader();
				}
				if (players.get(socket.id).role !== 'spectator') {
					io.to(currentGame.gameName).emit('gameInfos', { ...currentGame.gameInfos });
				}
			}
		}
	}
};

const sendBoardAndPieceToPlayer = (socket, updatedBoardAndScore) => {
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			// si besoin on créé la nouvelle pièce dans la game
			if (gameData.pieces.length <= players.get(socket.id).pieceId) {
				gameData.pieces.push(new Piece());
			}
			//on envoit la pièce suivante au joueur qui vient de poser
			socket.emit('updateNextPiece', [gameData.pieces[players.get(socket.id).pieceId]]);
			players.get(socket.id).pieceId++;
			players.get(socket.id).score = updatedBoardAndScore.score;
			//on envoit le board a l'adversaire
			socket.broadcast.to(gameId).emit('opponentBoardData', updatedBoardAndScore.updateBoard, players.get(socket.id).name, players.get(socket.id).score);
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
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name) && gameData.isRunning) {
			players.get(socket.id).gameOver = true;
			// on prévient l'autre joueur de sa victoire
			socket.broadcast.to(gameId).emit('playerLost', players.get(socket.id).name);
			// si tous les joueurs ont perdus sauf un, il a gagné
			winner = gameData.getWinner(); // rempli si gagnant sinon null
			if (winner) {
				console.log('winnerName ?:' + winner.name);
				winner.socket.emit('Victory');
				winner.winScore++;
				io.to(gameId).emit('playerWon', winner.name, winner.score);
				gameData.isRunning = false;
			}
			return;
		}
	}
}

const restartGame = (socket) => {
	for (const [gameId, gameData] of games.entries()) {
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {
			gameData.changeLeader();
			io.to(gameId).emit('gameInfos', { ...gameData.gameInfos });
			startGame(socket, gameId);
			return;
		}
	}
}

const askingForGameInfos = (socket) => {
	for (const [gameId, gameData] of games.entries()) {
		//si la game existe, lors d'un F5 par exemple, on renvoit les infos au joueur
		if (gameData.doesPlayerBelongToGame(players.get(socket.id).name)) {

		}
		return;
	}
}

const handleMatchMaking = (socket, dataStartGame) => {
	console.log('matchmaking called');
	if (!players.has(socket.id)) { // si le joueur n'existe pas, création
		console.log("new user = ", dataStartGame)
		player = new Player(dataStartGame.userName, dataStartGame.userWin, dataStartGame.userImage, socket);
		players.set(socket.id, player);
	}
	if (!dataStartGame.gameName) { // pas de game renseignée, c'est donc une création de game{
		currentGame = new Game(socket, dataStartGame.gameMode);
		games.set(currentGame.gameName, currentGame);
		socket.join(currentGame.gameName);
		players.get(socket.id).role = 'player';
		socket.emit('gameInfos', { ...currentGame.gameInfos, role: 'player' });
	} else { // nom renseigné, le joueur cherche une partie avec un nom spécifique
		currentGame = games.get(dataStartGame.gameName);
		if (currentGame) { // la partie existe
			if (currentGame.isRunning) {// game en cours, prevenir le client qu'il sera spectateur
				socket.join(currentGame.gameName);
				currentGame.addPlayer(socket);
				//tell everyone new comer but tell him he's spectator
				socket.emit('gameInfos', { ...currentGame.gameInfos, role: 'spectator' });
				players.get(socket.id).role = 'spectator';
			} else if (currentGame.players.length == maxPlayerPerGame) {// game pleine, on prévient
				socket.emit('GameFull');
			} else { // partie trouvée et places dispos, ajout à la salle d'attente
				socket.join(currentGame.gameName);
				currentGame.addPlayer(socket);
				// tell everyone new player
				io.to(currentGame.gameName).emit('gameInfos', { ...currentGame.gameInfos, role: 'player' });
				players.get(socket.id).role = 'player';
			}
		} else { // la partie n'existe pas, prévenir l'user et retour menu
			socket.emit('NoGameFound');
		}
	}
}

const startGame = (socket, gameName) => {
	currentGame = games.get(gameName);
	currentGame.resetGame();
	currentGame.isRunning = true

	io.to(currentGame.gameName).emit('gameStart', {
		piece: currentGame.pieces[0],
		nextPiece: currentGame.pieces[1],
		gameMode: currentGame.gameMode
	})
}

// sending to all clients in 'game' game(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
module.exports = { askingForGameInfos, startGame, restartGame, leavingGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking }