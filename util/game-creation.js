const { Message, User, MessageEmbed } = require('discord.js');
const Player = require('./card-player.js');
const CardGame = require('../game-types/card-game.js');
const botConfig = require('../config.js');

/**
 * oof
 *
 * @param {string} config oof
 * @param {Message} config.message discord message with command
 * @param {string} config.gamename name of game
 * @param {number} config.minPlayers minimum number of players
 * @param {number} config.maxPlayers maximum number of players
 * @returns {User[]} oof
 */
function readPlayers(config) {
  const players = [];
  players.push(config.message.author);
  config.message.mentions.users.forEach((user) => {
    if (!players.includes(user) && !user.bot) players.push(user);
  });

  // Check there are between the min and max (inclusive) players for the game
  if (players.length < config.minPlayers || players.length > config.maxPlayers) {
    config.message.reply(`${config.gamename} needs ${config.minPlayers}-${config.maxPlayers} players!
     "@" ${config.minPlayers - 1}-${config.maxPlayers - 1} other players for a game (no bots)`);
    return false;
  }
  return players;
}

/**
 * Check that given players are valid for a game
 *
 * @param {object} config configuration object for function
 * @param {Message} config.message discord message with command
 * @param {User[]} config.players Discord users to play
 * @returns {Map<Player>} player instances
 */
function checkValidPlayers(config) {
  // Check none of the players are already in a game
  const playersAlreadyInGame = [];
  config.players.forEach((potentialPlayer) => {
    if (config.message.client.usersInGames.includes(potentialPlayer.id)) {
      playersAlreadyInGame.push(potentialPlayer.username);
    }
  });
  if (playersAlreadyInGame.length) {
    config.message.reply(`Users: ${playersAlreadyInGame.join(', ')} are already in a game!`);
    return false;
  }

  // Create player instances for the game
  const gamePlayers = new Map();
  config.players.forEach((player) => {
    gamePlayers.set(player.id, new Player({ username: player.username, userId: player.id }));
    config.message.client.usersInGames.push(player.id);
  });
  return gamePlayers;
}

/**
 * @param {object} config configuration for making game
 * @param {Message} config.message discord message with command
 * @param {CardGame} config.game game being created
 * @param {string} config.gamename name of game being created
 */
function makeGame(config) {
  config.message.client.games.set(config.message.author.id, config.game);
  const response = new MessageEmbed()
    .setColor(botConfig.color)
    .setTitle(`${config.gamename}!`)
    .setDescription(`Players in game: ${config.game.players.map((player) => ` ${player.username}`)}\n
        Starting player: ${config.game.activePlayerName}`);
  config.message.channel.send(response);
}

module.exports = { checkValidPlayers, readPlayers, makeGame };
