import { Message } from 'discord.js';

const ping = {
  name: 'ping',
  aliases: [],
  description: 'Ping!',
  requiresArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 5,
  /**
   * Ping command. Respong Pong to pings
   *
   * @param {Message} message user invocation message
   */
  execute(message) {
    message.channel.send('Pong');
  },
};
export default ping;
