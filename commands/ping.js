const ping = {
  name: 'ping',
  description: 'Ping!',
  hasArgs: false,
  usage: '',
  guildOnly: false,
  execute(message, args) {
    message.channel.send('Pong.');
  },
};
export default ping;
