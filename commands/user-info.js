const userInfo = {
  name: 'user-info',
  aliases: [],
  description: 'See your Discord info',
  requiresArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 0,
  execute(message) {
    message.channel.send(`Your username: ${message.author.username}\n
        Your ID: ${message.author.id}`);
  },
};
export default userInfo;
