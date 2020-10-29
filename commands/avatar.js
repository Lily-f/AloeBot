const avatar = {
  name: 'avatar',
  aliases: ['icon', 'pfp'],
  description: 'See @\'d peoples avatars. ',
  hasArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 0,
  execute(message, args) {
    if (!message.mentions.users.size) {
      message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`);
    } else {
      const avatarList = message.mentions.users.map((user) => `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`);
      message.channel.send(avatarList);
    }
  },
};
export default avatar;
