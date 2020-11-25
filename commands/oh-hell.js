const { Message } = require('discord.js');
const OhHellGame = require('../game-types/oh-hell-game.js');
const { generateDeck } = require('../util/card.js');
const { checkValidPlayers, readPlayers, makeGame } = require('../util/game-creation.js');

const ohHell = {
  name: 'oh-hell',
  aliases: [],
  description: 'Start a game of Oh Hell',
  requiresArgs: true,
  usage: '@player2 @player3',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create Oh Hell card game command
   *
   * @param {Message} message  user invocation message
   */
  execute(message) {
    // Read discord users (players) from command
    const players = readPlayers({
      message, minPlayers: 1, maxPlayers: 7, gamename: 'Oh Hell',
    });
    if (!players) return;

    // Create player instances for users
    const gamePlayers = checkValidPlayers({ message, players });
    if (!gamePlayers) return;

    // Create the initial deck for the game
    const deck = generateDeck([]);

    // Create the game and tell users how to play
    const startPlayer = players[Math.floor(Math.random() * players.length)];
    const game = new OhHellGame({
      players: Array.from(gamePlayers.values()),
      deck,
      activePlayerId: startPlayer.id,
      activePlayerName: startPlayer.username,
      message,
    });
    makeGame({ message, game, gamename: 'Oh Hell' });
    // game.displayCards(players);
  },
};
module.exports = ohHell;
