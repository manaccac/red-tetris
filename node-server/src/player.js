class Player {
    name = '';
    socket;
    isInGame = false;
    score = 0;
    pieceId = 2;
    gameOver = false;
    status; //Statut: [player/spectator]
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
    }

    getName() {
        return this.name;
    }
}

module.exports = Player;