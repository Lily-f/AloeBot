const Message = require('discord.js');
const Game = require('../util/card-game.js');

const hearts = {
  name: 'hearts',
  aliases: [],
  description: 'Start a game of Hearts',
  requiresArgs: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create poll command
   *
   * @param {Message} message  user invocation message
   * @param {string[]} args args of commands in the message
   */
  execute(message, args) {
    const game = new Game();
    message.channel.send('Starting hearts! (in dev)');
  },
};
module.exports = hearts;
