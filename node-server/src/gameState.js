const games = new Map(); // [randomStringName, gameObject]
const players = new Map(); // [socketId,playerObject]
const maxPlayerPerGame = 2;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000'
    },
});

module.exports = {
    maxPlayerPerGame,
    games,
    players,
    http,
    io
};