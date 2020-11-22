const { Message, MessageEmbed } = require('discord.js');
const OhHellGame = require('../game-types/oh-hell-game.js');
const Player = require('../util/card-player.js');
const { generateDeck } = require('../util/card.js');
const config = require('../config.js');

const hearts = {
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
    const players = [];
    players.push(message.author);
    message.mentions.users.forEach((user) => {
      if (!players.includes(user) && !user.bot) players.push(user);
    });

    // Check there are between 3 and 7 (inclusive) players for the game
    if (players.length < 2 || players.length > 7) {
      message.reply('Oh Hell needs 3-7 players! "@" 1-6 other players for a game (no bots)');
      return;
    }

    // Check none of the players are already in a game
    const playersAlreadyInGame = [];
    players.forEach((potentialPlayer) => {
      if (message.client.usersInGames.includes(potentialPlayer.id)) {
        playersAlreadyInGame.push(potentialPlayer.username);
      }
    });
    if (playersAlreadyInGame.length) {
      message.reply(`Users: ${playersAlreadyInGame.join(', ')} are already in a game!`);
      return;
    }

    // Create player instances for the game
    const gamePlayers = new Map();
    players.forEach((player) => {
      gamePlayers.set(player.id, new Player({ username: player.username, userId: player.id }));
      message.client.usersInGames.push(player.id);
    });

    // Create the initial deck for the game
    const deck = generateDeck([]);

    // Create the game and tell users how to play
    const startPlayer = players[Math.floor(Math.random() * players.length)];
    const game = new OhHellGame({
      players: Array.from(gamePlayers.values()),
      deck,
      activePlayerId: startPlayer.id,
      activePlayerName: startPlayer.username,
    });
    message.client.games.set(message.author.id, game);
    const response = new MessageEmbed()
      .setColor(config.color)
      .setTitle('Oh Hell!')
      .setDescription(`Players in game: ${Array.from(gamePlayers.values()).map((player) => ` ${player.username}`)}\n
        Starting player: ${game.activePlayerName}`);
    message.channel.send(response);

    // Tell user their cards
    const playerCards = new MessageEmbed()
      .setColor(config.color)
      .setTitle('You\'ve started a Oh Hell game!');
    players.forEach((player) => {
      const playerHand = [];
      gamePlayers.get(player.id).hand.forEach((card) => { playerHand.push(card.toString()); });
      player.send(playerCards.setDescription(`Your cards are: \n\`${playerHand.join(', ')}\``));
    });
  },
};
module.exports = hearts;
