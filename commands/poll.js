import { Message, MessageEmbed } from 'discord.js';
import config from '../config.js';

const poll = {
  name: 'poll',
  aliases: [],
  description: 'Create a poll',
  requiresArgs: true,
  usage: '"Topic name/description" [Poll time (seconds)] option1 option2 option3...',
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
    if (options.length < 2 || options.length > 20) {
      message.reply('Poll must have between 2 and 20 options!');
      return;
    }

    // Create string representing options
    let optionsString = '';
    const possibleEmoji = Object.keys(config.unicodeEmoji).map(
      (emoji) => config.unicodeEmoji[emoji],
    );
    for (let i = 0; i < options.length; i += 1) {
      optionsString += `${possibleEmoji[i]}: ${options[i]}\n\n`;
    }

    // Create embed representing the poll
    const pollEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle(`Poll - ${topic}`)
      .setDescription(`To vote, react using the corresponding emoji. Voting ends in ${timeout} seconds!\n${optionsString}`)
      .setFooter(`Poll created by ${message.author.username}`);
    message.channel.send(pollEmbed);
  },
};
export default poll;
