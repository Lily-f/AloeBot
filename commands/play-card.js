const Message = require('discord.js');

const playCard = {
  name: 'play-card',
  aliases: [],
  description: 'Play a card for an ongoing game',
  requiresArgs: true,
  usage: '',
  guildOnly: true,
  cooldown: 0,
  /**
   * Play card command. Handles when a user plays a card for a game
   *
   * @param {Message} message user invocation message
   */
  execute(message) {
  },
};
module.exports = playCard;
