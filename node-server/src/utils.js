const leavingGame = (socket, rooms, io, type) => {
	for (const [roomId, roomData] of rooms.entries()) {
		const clients = roomData.clients;
		if (!clients) return;
		const index = clients.indexOf(socket);
		if (index !== -1) {
			clients.splice(index, 1);
			rooms.set(roomId, { clients: clients, pieces: roomData.pieces });
			if (clients.length === 0) {
				rooms.delete(roomId);
				console.log('room is empty, deleting it');
			} else {
				//On previent le client restant qu'il a gagné
				io.to(roomId).emit("Victory");
			}
			console.log('socketId: ' + socket.id + ' left the game\n');
		}
	}
};

const sendBoardAndPieceToPlayer = (socket, rooms, updatedBoard) => {
    for (const [roomId, roomData] of rooms.entries()) {
        const clients = roomData.clients;
        const index = clients.indexOf(socket);
        if (index !== -1) {
            // si besoin on créé la nouvelle pièce dans la room
            if (roomData.pieces.length <= socket.pieceId) {
                roomData.pieces.push(generateNewPiece());
            }
            //on envoit la pièce suivante au joueur qui vient de poser
            socket.emit('updateNextPiece', [roomData.pieces[socket.pieceId]]);
            console.log('socket.pieceId: ' + socket.pieceId);
            console.log('nextPiece generated');
            console.log(roomData.pieces[socket.pieceId]);
            console.log('pieces list:');
            console.log(roomData.pieces);
            socket.pieceId++;
            
            //on envoit le board et les données du joueur à tous les autres joueurs de la salle
            socket.broadcast.to(roomId).emit('updateOpponentData', {
                board: updatedBoard,
                name: socket.username,
                id: socket.id
            });
        }
    }
}


const sendLinesToPlayer = (socket, rooms, numberOfLines) => {
    for (const [roomId, roomData] of rooms.entries()) {
        const clients = roomData.clients;
        const index = clients.indexOf(socket);
        if (index !== -1) {
            const otherPlayers = clients.filter(player => player !== socket);
            const randomOpponent = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            if (randomOpponent) {
                randomOpponent.emit('receivedLines', numberOfLines);
            }
        }
    }
}


const gameOver = (socket, rooms) => {
    for (const [roomId, roomData] of rooms.entries()) {
        const clients = roomData.clients;
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
            if (clients.length === 1) {
                clients[0].emit('Victory');
                rooms.delete(roomId);
            }
        }
    }
}


const handleMatchMaking = (socket, rooms, dataStartGame, io) => {
    if (!socket.username) {
        socket.username = dataStartGame.userName;
    }
    let room = null;
    for (const [roomId, roomData] of rooms.entries()) {
        const clients = roomData.clients;
        if (clients.length < 4 && roomId.includes(dataStartGame.gameMode)) {
            room = roomId;
            break;
        }
    }
    if (room === null) {
        room = socket.id + dataStartGame.gameMode;
        rooms.set(room, { clients: [], pieces: [] });
    }
    const clients = rooms.get(room).clients;
    clients.push(socket);
    //reset le pieceId pour l'attribution équitable de pièces
    socket.pieceId = 0;
    rooms.set(room, { clients: clients, pieces: [] });
    socket.join(room);

    if (rooms.get(room).clients.length === 3) {
        const players = rooms.get(room).clients;
        console.log('gonna emit gameStart');
        let piece = generateNewPiece();
        let nextPiece = generateNewPiece();

		players.forEach((playerSocket, index) => {
			let opponents = players.filter(p => p.id !== playerSocket.id).map(p => p.username);
			playerSocket.emit('gameStart', {
				isFirstPlayer: index === 0,
				opponentNames: opponents, // Note: This is now an array of opponent names
				piece: piece,
				nextPiece: nextPiece
			});
		});		
    }
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
// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
module.exports = { leavingGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking, generateNewPiece }