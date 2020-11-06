const { Message, MessageEmbed } = require('discord.js');
const Game = require('../util/card-game.js');
const Player = require('../util/card-player.js');
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
    const players = [];
    players.push(message.author);
    message.mentions.users.forEach((user) => {
      if (!players.includes(user) /* && !user.bot */) players.push(user);
    });

    // Check there are between 3 and 6 (inclusive) players for the game
    if (players.length < 2 || players.length > 5) {
      message.reply('Hearts needs 3-5 players! "@" 1-4 other players for a game (no bots)');
      return;
    }

    // Check none of the players are already in a game
    const playersAlreadyInGame = [];
    message.client.games.forEach((game, creatorId) => {
      game.players.forEach((player) => {
        players.forEach((potentialPlayer) => {
          if (potentialPlayer.id === player.id) playersAlreadyInGame.push(potentialPlayer.username);
        });
      });
    });
    if (playersAlreadyInGame.length) {
      message.reply(`Users: ${playersAlreadyInGame.join(', ')} are already in a game!`);
      return;
    }

    // Create player instances for the game
    const gamePlayers = [];
    players.forEach((player) => {
      gamePlayers.push(new Player({ username: player.username, id: player.id }));
    });

    // Cretae the deck for the game (remove cards based on player count)
    let deck = [];
    if (players.length === 3) deck = generateDeck([{ suit: 'Clubs', value: '2' }]);
    else if (players.length === 5) deck = generateDeck([{ suit: 'Clubs', value: '2' }, { suit: 'Diamonds', value: '2' }]);
    else deck = generateDeck([]);

    const game = new Game({ players: gamePlayers, deck });
    message.client.games.set(message.author.id, game);
    const response = new MessageEmbed()
      .setColor(config.color)
      .setTitle('Hearts!')
      .setDescription(`Players in game: ${gamePlayers.map((player) => `${player.username}: ${player.hand.map((card) => `${card.suit}:${card.value}`)}\n`)}`);
    message.channel.send(response);
  },
};
module.exports = hearts;
