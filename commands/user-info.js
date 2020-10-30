import { Message } from 'discord.js';

const userInfo = {
  name: 'user-info',
  aliases: [],
  description: 'See your Discord info',
  requiresArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 0,
  /**
   * User info command. Send user info about their discord account
   *
   * @param {Message} message user invocation message
   */
  execute(message) {
    message.channel.send(`Your username: ${message.author.username}\n
        Your ID: ${message.author.id}`);
  },
};
export default userInfo;
