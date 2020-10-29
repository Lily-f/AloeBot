const ping = {
  name: 'help',
  aliases: ['commands'],
  description: 'List all of my commands or info about a specific command.',
  requiresArgs: false,
  usage: '[command name]',
  guildOnly: false,
  cooldown: 5,
  execute(message, args) {
    message.channel.send('Pong');
  },
};
export default ping;
