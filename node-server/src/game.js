const { games, players, maxPlayerPerGame } = require('./gameState');
const Piece = require('./piece');
const Player = require('./player');

class Game {
    gameName = '';
    players = [];
    isRunning = false;
    leader; // nom du chef de la room
    mode; //Random Gravity, Normal, Invisible,
    generatedPieces = []; // array de Pieces
    constructor(socket, gameMode) {
        const randomAnimalName = require('random-animal-name');
        do {
            this.gameName = randomAnimalName().replaceAll(' ', '');
        } while (games.has(this.gameName))
        this.leader = players.get(socket.id).name;
        this.players.push(players.get(socket.id));
        this.gameMode = gameMode
        this.generatedPieces.push(new Piece());
        this.generatedPieces.push(new Piece());
    }

    getPlayerNames() {
        return this.players.map(player => player.getName());
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
        this.players.push(players.get(socket.Id));
    }

    removePlayer(socket) {
        this.players = this.players.filter(player => player.getName() !== players.get(socket.id).name);
    }
}

module.exports = Game; 