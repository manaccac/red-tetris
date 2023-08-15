const { games, players, maxPlayerPerGame } = require('./gameState');
const Piece = require('./piece');
const Player = require('./player');

class Game {
    gameName = '';
    players = [];
    isRunning = false;
    leader; // nom du chef de la room
    mode; //Random Gravity, Normal, Invisible,
    pieces = []; // array de Pieces
    constructor(socket, gameMode) {
        const randomAnimalName = require('random-animal-name');
        do {
            this.gameName = randomAnimalName().replaceAll(' ', '');
        } while (games.has(this.gameName))
        this.leader = players.get(socket.id).name;
        this.players.push(players.get(socket.id));
        this.gameMode = gameMode
        this.pieces.push(new Piece());
        this.pieces.push(new Piece());
    }

    getPlayerNames() {
        if (this.players.length > 0)
            return this.players.map(player => player.getName());
        else {
            return '';
        }
    }

    get gameInfos() {
        return {
            leader: this.leader,
            players: this.getPlayerNames(),
            gameMode: this.gameMode,
            gameName: this.gameName,
            role: undefined,
        }
    }

    addPlayer(socket) {
        console.log('adding player to game');
        this.players.push(players.get(socket.id));
    }

    removePlayer(socket) {
        this.players = this.players.filter(player => player.getName() !== players.get(socket.id).name);
    }

    doesPlayerBelongToGame(playerName) {
        return this.players.some(player => player.getName() === playerName);
    }

    getWinner() {
        const playersWithGameOverFalse = this.players.filter(player => !player.gameOver);
        if (playersWithGameOverFalse.length === 1) {
            return playersWithGameOverFalse[0];
        } else {
            return null;
        }
    }

    changeLeader() {
        newLeader = this.players[Math.floor(Math.random() * this.players.size)].name;
    }

    resetGame() {
        this.pieces = [];
        this.pieces.push(new Piece());
        this.pieces.push(new Piece());
        currentGame.players.forEach((player) => player.pieceId = 0);
    }
}

module.exports = Game; 