const OhHellGame = require('../game-types/oh-hell-game.js');
const Player = require('../util/card-player.js');
const ProxyMessage = require('./proxy-message.js');
const { Card } = require('../util/card.js');

// Create deck and players
const deck = [
  new Card({ suit: 'HEARTS', value: '2' }),
  new Card({ suit: 'SPADES', value: '3' }),
  new Card({ suit: 'CLUBS', value: '4' }),
];// generateDeck([{ suit: 'CLUBS', value: '2' }]);
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
const game = new OhHellGame(gameConfig);
const proxyMessage = new ProxyMessage();

// Play a trick
for (let i = 0; i < 6; i += 1) {
  const player = players.find((p) => p.userId === game.activePlayerId);
  const card = player.hand[0];
  if (game.playCard({ message: proxyMessage, card, player })) player.hand.shift();
}
