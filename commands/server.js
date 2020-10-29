const server = {
  name: 'server',
  aliases: [],
  description: 'See Discord server info',
  requiresArgs: false,
  usage: '',
  guildOnly: true,
  cooldown: 0,
  execute(message) {
    message.channel.send(`This server is called ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
};
export default server;
