class Player {
	name = '';
	image;
	winScore = 0;
	socket;
	isInGame = false;
	score = 0;
	pieceId = 2;
	gameOver = false;
	status; //Statut: [player/spectator]
	constructor(name, image, socket) {
		this.name = name;
		this.image = image;
		this.socket = socket;
	}

	getPlayeInfo() {
		const res = {
			name: this.name,
			winScore: this.winScore,
			image: this.image,
		}
		return res;
	}

	getName() {
		return this.name;
	}
	getWinScore() {
		return this.winScore;
	}
	getImage() {
		return this.image;
	}
}

module.exports = Player;