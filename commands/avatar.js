const avatar = {
  name: 'avatar',
  description: 'See @\'d peoples avatars. ',
  hasArgs: false,
  usage: '',
  guildOnly: false,
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
