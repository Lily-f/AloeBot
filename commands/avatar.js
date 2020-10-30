import { Message } from 'discord.js';

const avatar = {
  name: 'avatar',
  aliases: ['icon', 'pfp'],
  description: 'See @\'d peoples avatars. ',
  requiresArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 0,
  /**
   * Avatar command. Send user image of their avatar or @'d users avatars
   *
   * @param {Message} message user invocation message
   */
  execute(message) {
    if (!message.mentions.users.size) {
      message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`);
    } else {
      const avatarList = message.mentions.users.map((user) => `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`);
      message.channel.send(avatarList);
    }
  },
};
export default avatar;
