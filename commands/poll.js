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
    if (quotesNumber < 2) message.reply('Poll topic command requires at least 2 double quote marks!');

    // Get topic from message and all args beyond topic
    const topic = message.content.substring(message.content.indexOf('"') + 1, message.content.lastIndexOf('"'));
    const messageAfterTopic = message.content.substring(message.content.lastIndexOf('"') + 1);
    const args = messageAfterTopic.trim().split(/ +/);

    const timeout = parseInt(args[0], 10);
    const forceEndReact = args[1];
    const reactOptions = args.slice(2, args.length);
    message.channel.send(`making a poll! topic:'${topic}', timeout:'${timeout}', endReact:'${forceEndReact}, reactOptions:'${reactOptions}'`);
  },
};
export default poll;
