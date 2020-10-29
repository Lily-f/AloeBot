const server = {
  name: 'server',
  description: 'See Discord server info',
  execute(message, args) {
    message.channel.send(`This server is called ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
};
export default server;
