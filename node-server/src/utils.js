const leavingGame = (socket, rooms, io, type) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket);
		if (index !== -1) {
			clients.splice(index, 1);
			rooms.set(roomId, clients);
			if (clients.length === 0) {
				rooms.delete(roomId);
				console.log('room is empty, deleting it');
			} else {
				//On previent le client restant qu'il a gagné
				io.to(roomId).emit("Victory");
			}
			console.log('socketId: ' + socket.id + ' left the game\n');
			return rooms;
		}
	}
};

const sendBoardToPlayer = (socket, rooms, updatedBoard) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket);
		if (index !== -1) {
			socket.broadcast.to(roomId).emit('opponentBoardData', updatedBoard);
		}
	}
}

const sendLinesToPlayer = (socket, rooms, numberOfLines) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket);
		if (index !== -1) {
			socket.broadcast.to(roomId).emit('receivedLines', numberOfLines);
		}
	}
}

const gameOver = (socket, rooms) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket);
		if (index !== -1) {
			// on prévient l'autre joueur de sa victoire
			socket.broadcast.to(roomId).emit('Victory');
			rooms.delete(roomId);
			console.log('after deleting, roomsleft : ' + rooms.size);
		}
	}
}

const handleMatchMaking = (socket, rooms, userName, io) => {
	if (!socket.username) {
		socket.username = userName;
	}
	let room = null;
	for (const [roomId, clients] of rooms.entries()) {
		if (clients.length < 2) {
			room = roomId;
			break;
		}
	}
	if (room === null) {
		room = socket.id + Math.floor(Math.random() * 2000000);
		rooms.set(room, []);
	}
	const clients = rooms.get(room);
	clients.push(socket);
	rooms.set(room, clients);
	socket.join(room);
	if (rooms.get(room).length === 2) {
		const players = rooms.get(room);
		console.log('gonna emit gameStart');
		players[0].emit('gameStart', { isFirstPlayer: true, opponentName: players[1].username })
		players[1].emit('gameStart', { isFirstPlayer: false, opponentName: players[0].username })
	}
}

// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
module.exports = { leavingGame, sendBoardToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking }