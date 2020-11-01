import { Message } from 'discord.js';

const poll = {
  name: 'poll',
  aliases: [],
  description: 'Create a poll',
  requiresArgs: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create poll command
   *
   * @param {Message} message  user invocation message
   */
  execute(message) {
    // Find topic, determined by two quotes in the mesasge
    const matches = message.content.match(/"/g);
    const quotesNumber = matches ? matches.length : 0;
    if (quotesNumber < 2) {
      message.reply('Poll topic command requires at least 2 double quote marks!');
      return;
    }
    const topic = message.content.substring(message.content.indexOf('"') + 1, message.content.lastIndexOf('"'));

    // Get and check arguments for the command
    const messageAfterTopic = message.content.substring(message.content.lastIndexOf('"') + 1);
    const args = messageAfterTopic.trim().split(/ +/);

    const timeout = parseInt(args[0], 10);
    if (Number.isNaN(timeout) || timeout <= 0) {
      message.reply('Timeout needs to be a number greater than 0!');
      return;
    }
    const options = args.slice(1, args.length);

    // Create embed representing the poll
    message.channel.send(`making a poll! topic:'${topic}', timeout:'${timeout}', options:'${options}'`);
  },
};
export default poll;
