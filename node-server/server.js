const { askingForGameInfos, leavingGame, restartGame, startGame, sendBoardAndPieceToPlayer, sendLinesToPlayer, gameOver, handleMatchMaking } = require('./src/utils');
const { http, io, players } = require('./src/gameState');
const Player = require('./src/player');
http.listen(3001, () => {
    console.log('Server is running on port 3001');
});

io.on('connection', (socket) => {

    socket.on('setUserInfos', (userInfos) => {
        var isAvailable = true;
        for (const [socketId, player] of players) {
            if (player.getName() === userInfos.username) {
                isAvailable = false;
                break;
            }
        }
        if (isAvailable) {
            let player = new Player(userInfos.username, userInfos.userWin, userInfos.imageId, socket);
            players.set(socket.id, player);
        }

        console.log('name available ? : ' + isAvailable);
        socket.emit('usernameRep', isAvailable);
    });

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
        leavingGame(socket);
        players.delete(socket.id);
    });

    socket.on('leftGame', () => {
        leavingGame(socket);
    });

    socket.on('updateBoard', (updatedBoardAndScore) => {
        sendBoardAndPieceToPlayer(socket, updatedBoardAndScore, players.get(socket.id).name);
    });

    socket.on('sendLines', (numberOfLines) => {
        console.log('reiceived sendLines, sending:' + numberOfLines);
        sendLinesToPlayer(socket, numberOfLines);
    });

    // socket.on('askingGameInfos', () => {
    //     askingForGameInfos(socket);
    // });

    socket.on('gameOver', () => {
        gameOver(socket);
    });
});

module.exports = { io };