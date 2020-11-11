const { Message, MessageEmbed } = require('discord.js');
const HeartsGame = require('../game-types/hearts-game.js');
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

    // Create the deck for the game (remove cards based on player count)
    let deck = [];
    if (players.length === 3) deck = generateDeck([{ suit: 'CLUBS', value: '2' }]);
    else if (players.length === 5) deck = generateDeck([{ suit: 'CLUBS', value: '2' }, { suit: 'DIAMONDS', value: '2' }]);
    else deck = generateDeck([]);

    // Create the game and tell users how to play
    const startPlayer = players[0];// players[Math.floor(Math.random() * players.length)];
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
    const playerCards = new MessageEmbed()
      .setColor(config.color)
      .setTitle('You\'ve started a Hearts game!');
    players.forEach((player) => {
      const playerHand = [];
      gamePlayers.get(player.id).hand.forEach((card) => { playerHand.push(card.toString()); });
      player.send(playerCards.setDescription(`Your cards are: \n\`${playerHand.join(', ')}\``));
    });
  },
};
module.exports = hearts;
