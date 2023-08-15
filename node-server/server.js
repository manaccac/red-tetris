const { askingForGameInfos, leavingGame, restartGame, startGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking } = require('./src/utils');
const { http, io, players } = require('./src/gameState');

http.listen(3001, () => {
    console.log('Server is running on port 3001');
});

io.on('connection', (socket) => {
    socket.on('lookingForAGame', (dataStartGame) => {
        handleMatchMaking(socket, dataStartGame);
    });

    socket.on('restartGame', () => {
        restartGame(socket);
    });

    socket.on('startGame', (gameName) => {
        console.log('gameName called');
        console.log(gameName);
        startGame(socket, gameName);
    });

    socket.on('disconnect', () => {
        console.log('socket Id disconnected :' + socket.id);
        leavingGame(socket, io, 'disconnect');
    });

    socket.on('leftGame', () => {
        leavingGame(socket, io, 'leftGame');
    });

    socket.on('updateBoard', (updatedBoard) => {
        sendBoardAndPieceToPlayer(socket, updatedBoard, players.get(socket.id).name);
    });

    socket.on('sendLines', (numberOfLines) => {
        console.log('reiceived sendLines, sending:' + numberOfLines);
        sendLinesToPlayer(socket, numberOfLines);
    });

    socket.on('askingGameInfos', () => {
        askingForGameInfos(socket);
    });

    socket.on('gameOver', () => {
        gameOver(socket);
    });
});

module.exports = { io };