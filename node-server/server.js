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

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('chat message', (message) => {
        console.log('Received message:', message);
        io.emit('chat message', message);
    });
});
