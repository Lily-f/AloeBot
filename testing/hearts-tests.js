const HeartsGame = require('../game-types/hearts-game.js');
const Player = require('../util/card-player.js');
const { generateDeck } = require('../util/card.js');

const deck = generateDeck([{ suit: 'CLUBS', value: '2' }]);
const players = [
  new Player({ username: 'playerOne', userId: '1' }),
  new Player({ username: 'playerTwo', userId: '2' }),
  new Player({ username: 'playerThree', userId: '3' }),
];
const startPlayer = players[0];

const gameConfig = {
  players,
  deck,
  activePlayerId: startPlayer.id,
  activePlayerName: startPlayer.username,
};
const game = new HeartsGame(gameConfig);
console.log(JSON.stringify(game));
