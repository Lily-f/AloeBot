const Message = require('discord.js');

const server = {
  name: 'server',
  aliases: [],
  description: 'See Discord server info',
  requiresArgs: false,
  usage: '',
  guildOnly: true,
  cooldown: 0,
  /**
   * Server info command. Send user info about the server the message is called from
   *
   * @param {Message} message  user invocation message
   */
  execute(message) {
    message.channel.send(`This server is called ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
};
module.exports = server;
