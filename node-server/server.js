const { leavingGame, restartGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking } = require('./src/utils');
const { http, io } = require('./src/gameState');

http.listen(3001, () => {
    console.log('Server is running on port 3001');
});

io.on('connection', (socket) => {
    socket.on('lookingForAGame', (dataStartGame) => {
        handleMatchMaking(socket, dataStartGame);
    });

    socket.on('restartGame', (dataStartGame) => {
        restartGame(socket, dataStartGame);
    });

    socket.on('startGame', () => {
        startGame(socket, gameName);
    });

    socket.on('disconnect', () => {
        console.log('socket Id disconnected :' + socket.id);
        leavingGame(socket, io, 'disconnect');
    });

    socket.on('leftGame', () => {
        leavingGame(socket, io, 'leftGame');
    });

    // socket.on('updateBoard', (dataBoard) => {
    //     sendBoardAndPieceToPlayer(socket, dataBoard);
    socket.on('updateBoard', (updatedBoard, userName) => {
        console.log('server received update board');
        sendBoardAndPieceToPlayer(socket, rooms, updatedBoard, userName);
    });

    socket.on('sendLines', (numberOfLines) => {
        console.log('reiceived sendLines, sending:' + numberOfLines);
        sendLinesToPlayer(socket, numberOfLines);
    });

    socket.on('gameOver', () => {
        gameOver(socket);
    });
});

module.exports = { io };