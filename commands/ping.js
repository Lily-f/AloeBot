const ping = {
  name: 'ping',
  aliases: [],
  description: 'Ping!',
  requiresArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 5,
  execute(message) {
    message.channel.send('Pong');
  },
};
export default ping;
