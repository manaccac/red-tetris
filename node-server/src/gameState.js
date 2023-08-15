const games = new Map(); // [randomStringName, gameObject]
const players = new Map(); // [socketId,playerObject]
const maxPlayerPerGame = 7;

module.exports = {
    maxPlayerPerGame,
    games,
    players
};