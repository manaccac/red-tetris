const leavingGame = (socket, rooms, io, type) => {
	for (const [roomId, clients] of rooms.entries()) {
		console.log('room: ' + roomId);
		console.log('list of clients: ' + clients);
		const index = clients.indexOf(socket.id);
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
		const index = clients.indexOf(socket.id);
		if (index !== -1) {
			socket.broadcast.to(roomId).emit('opponentBoardData',updatedBoard);
		}
	}
}

const sendLinesToPlayer = (socket, rooms, numberOfLines) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket.id);
		if (index !== -1) {
			socket.broadcast.to(roomId).emit('receivedLines',numberOfLines);
		}
	}
}

const gameOver = (socket, rooms) => {
	for (const [roomId, clients] of rooms.entries()) {
		const index = clients.indexOf(socket.id);
		if (index !== -1) {
			// on prévient l'autre joueur de sa victoire
			socket.broadcast.to(roomId).emit('Victory');
			rooms.delete(roomId);
			console.log('after deleting, roomsleft : ' + rooms.size);
		}
	}
}

// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
module.exports = { leavingGame, sendBoardToPlayer, sendLinesToPlayer, gameOver }