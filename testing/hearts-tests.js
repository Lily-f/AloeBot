const HeartsGame = require('../game-types/hearts-game.js');
const Player = require('../util/card-player.js');
const ProxyMessage = require('./proxy-message.js');
const { generateDeck } = require('../util/card.js');

// Create deck and players
const deck = generateDeck([{ suit: 'CLUBS', value: '2' }]);
const players = [
  new Player({ username: 'playerOne', userId: '1' }),
  new Player({ username: 'playerTwo', userId: '2' }),
  new Player({ username: 'playerThree', userId: '3' }),
];
const startPlayer = players[0];

// Create game
const gameConfig = {
  players,
  deck,
  activePlayerId: startPlayer.userId,
  activePlayerName: startPlayer.username,
};
const game = new HeartsGame(gameConfig);
const proxyMessage = new ProxyMessage();

// Play a trick
for (let i = 0; i < 3; i += 1) {
  const player = players.find((p) => p.userId === game.activePlayerId);
  const randIndex = Math.floor(Math.random() * player.hand.length);
  const card = player.hand[randIndex];
  player.hand.splice(randIndex, 1);
  game.playCard({ message: proxyMessage, card, player });
}
