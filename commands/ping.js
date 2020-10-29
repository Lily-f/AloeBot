const ping = {
  name: 'ping',
  aliases: [],
  description: 'Ping!',
  hasArgs: false,
  usage: '',
  guildOnly: false,
  cooldown: 5,
  execute(message, args) {
    message.channel.send('Pong.');
  },
};
export default ping;
