const express = require('express');
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
            room = socket.id;
            rooms.set(room, []);
        }
        const clients = rooms.get(room);
        const index = clients.indexOf(socket.id);
        if (index == -1) {
            clients.push(socket.id);
        }
        rooms.set(room, clients);
        socket.join(room);
        if (rooms.get(room).length === 2) {
            console.log('lets start game');
            io.to(room).emit('gameStart');
        }
    });

    socket.on('disconnect', () => {
        console.log('socket Id disconnected :' + socket.id);

        for (const [roomId, clients] of rooms.entries()) {
            console.log('room: ' + roomId);
            console.log('list of clients: ' + clients);
            const index = clients.indexOf(socket.id);
            if (index !== -1) {
                clients.splice(index, 1);
                rooms.set(roomId, clients);

                if (clients.length === 0) {
                    rooms.delete(roomId);
                }
                break;
            }
        }
    });
});
