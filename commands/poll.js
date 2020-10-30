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
    // Find number of quotes used in message, to determine the topic of poll
    const matches = message.content.match(/"/g);
    const quotesNumber = matches ? matches.length : 0;

    // If there are not exactly 2 quotes, send command malformed error
    if (quotesNumber !== 2) message.reply('Poll topic command requires exactly 2 double quote marks!');

    // Get topic from message and all args beyond topic
    const topic = /"(.*?)"/g.exec(message.content).pop();
    message.channel.send(`topic: ${topic}`);

    // Topic is the message from the start till the first comma
    // const topic = message.content.match(/'([^']+)'/)[1];
    // const topic = args[0];
    // const timeout = args[1];
    // const forceEndReact = args[2];
    // const reactOptions = args.slice(3, args.length);
    // message.channel.send(`making a poll! ${topic}`);
  },
};
export default poll;
