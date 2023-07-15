const express = require('express');
const { leavingGame, sendBoardToPlayer, sendLinesToPlayer, gameOver } = require('./src/utils');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000'
    },
});

http.listen(3001, () => {
    console.log('Server is running on port 3001');
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('socket Id connected :' + socket.id);
    socket.on('lookingForAGame', (userName) => {
        console.log('lfg called');
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
    	clients.push(socket.id);
        rooms.set(room, clients);
        socket.join(room);
        if (rooms.get(room).length === 2) {
            console.log('lets start game');
            io.to(room).emit('gameStart');
        }
    });

    socket.on('disconnect', () => {
        console.log('socket Id disconnected :' + socket.id);
        leavingGame(socket, rooms, io, 'disconnect');
    });

	socket.on('leftGame', () => {
        leavingGame(socket, rooms, io, 'leftGame');
    });

	socket.on('updateBoard', (updatedBoard) => {
		sendBoardToPlayer(socket, rooms, updatedBoard);
	});

	socket.on('sendLines',(numberOfLines) => {
		sendLinesToPlayer(socket, rooms, numberOfLines);
	});

	socket.on('gameOver',() => {
		gameOver(socket, rooms);
	});
});
