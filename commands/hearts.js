const { Message, MessageEmbed } = require('discord.js');
const HeartsGame = require('../game-types/hearts-game.js');
const { checkValidPlayers, readPlayers } = require('../util/game-creation.js');
const { generateDeck } = require('../util/card.js');
const config = require('../config.js');

const hearts = {
  name: 'hearts',
  aliases: [],
  description: 'Start a game of Hearts',
  requiresArgs: true,
  usage: '@player2 @player3',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create poll command
   *
   * @param {Message} message  user invocation message
   */
  execute(message) {
    // Read discord users (players) from command
    const players = readPlayers({
      message, minPlayers: 2, maxPlayers: 5, gamename: 'Hearts',
    });
    if (!players) return;

    // Create playr instances for users
    const gamePlayers = checkValidPlayers({ message, players });
    if (!gamePlayers) return;

    // Create the deck for the game (remove cards based on player count)
    let deck = [];
    if (players.length === 3) deck = generateDeck([{ suit: 'CLUBS', value: '2' }]);
    else if (players.length === 5) deck = generateDeck([{ suit: 'CLUBS', value: '2' }, { suit: 'DIAMONDS', value: '2' }]);
    else deck = generateDeck([]);

    // Create the game and tell users how to play
    const startPlayer = players[Math.floor(Math.random() * players.length)];
    const game = new HeartsGame({
      players: Array.from(gamePlayers.values()),
      deck,
      activePlayerId: startPlayer.id,
      activePlayerName: startPlayer.username,
    });
    message.client.games.set(message.author.id, game);
    const response = new MessageEmbed()
      .setColor(config.color)
      .setTitle('Hearts!')
      .setDescription(`Players in game: ${Array.from(gamePlayers.values()).map((player) => ` ${player.username}`)}\n
        Starting player: ${game.activePlayerName}`);
    message.channel.send(response);

    // Tell user their cards
    game.displayCards(players);
  },
};
module.exports = hearts;
