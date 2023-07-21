const express = require('express');
const { leavingGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking } = require('./src/utils');
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
    socket.on('lookingForAGame', (dataStartGame) => {
        handleMatchMaking(socket, rooms, dataStartGame, io);
    });

    socket.on('disconnect', () => {
        console.log('socket Id disconnected :' + socket.id);
        leavingGame(socket, rooms, io, 'disconnect');
    });

    socket.on('leftGame', () => {
        leavingGame(socket, rooms, io, 'leftGame');
    });

    socket.on('updateBoard', (updatedBoard) => {
        console.log('server received update board');
        sendBoardAndPieceToPlayer(socket, rooms, updatedBoard);
    });

    socket.on('sendLines', (numberOfLines) => {
        console.log('reiceived sendLines, sending:' + numberOfLines);
        sendLinesToPlayer(socket, rooms, numberOfLines);
    });

    socket.on('gameOver', () => {
        gameOver(socket, rooms);
    });
});
