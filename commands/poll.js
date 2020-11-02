import { Message, MessageEmbed } from 'discord.js';
import config from '../config.js';

const poll = {
  name: 'poll',
  aliases: [],
  description: 'Create a poll. Users have multiple votes',
  requiresArgs: true,
  usage: '"Topic name/description" [Poll time (minutes)] option1 option2 option3...\n\t\t\t eg: ^poll "Best animal" 0.2 cats dogs sheep pigs mice',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create poll command
   *
   * @param {Message} message  user invocation message
   */
  async execute(message) {
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
    const timeout = parseFloat(args[0], 10);
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
    const usedEmoji = [];
    const optionFreq = {};
    const possibleEmoji = Object.keys(config.unicodeEmoji).map(
      (emoji) => config.unicodeEmoji[emoji],
    );
    for (let i = 0; i < options.length; i += 1) {
      optionsString += `${possibleEmoji[i]} : ${options[i]}\n\n`;
      usedEmoji.push(possibleEmoji[i]);
      optionFreq[possibleEmoji[i]] = { option: options[i], votes: 0 };
    }

    // Create embed representing the poll
    const pollEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle(`Poll - ${topic}`)
      .setDescription(`To vote, react using the corresponding emoji. Voting ends in ${timeout} minutes!\n${optionsString}`)
      .setFooter(`Poll created by ${message.author.username}`);

    // Send Embed and add reaction collecter
    const pollMessage = await message.channel.send(pollEmbed);
    usedEmoji.forEach((emoji) => { pollMessage.react(emoji); });
    const reactionCollector = pollMessage.createReactionCollector(
      (reaction, user) => usedEmoji.includes(reaction.emoji.name) && !user.bot,
      { time: timeout * 60000 },
    );

    // Update frequencies of new reacts
    reactionCollector.on('collect', (reaction) => {
      if (usedEmoji.includes(reaction.emoji.name)) {
        optionFreq[reaction.emoji.name].votes += 1;
      }
    });

    // Update frequency when reacts removed
    reactionCollector.on('dispose', (reaction) => {
      if (usedEmoji.includes(reaction.emoji.name)) {
        optionFreq[reaction.emoji.name].votes -= 1;
      }
    });

    // Display embed of results when timeout occurs
    reactionCollector.on('end', () => {
      pollMessage.delete();
      let results = '';
      Object.values(optionFreq).forEach((option) => { results += `${option.option} - ${option.votes}\n`; });
      const resultsEmbed = new MessageEmbed()
        .setColor(config.color)
        .setTitle(`Poll - ${topic} is Finished!`)
        .setDescription(`${results}`)
        .setFooter(`Poll created by ${message.author.username}`);
      message.channel.send(resultsEmbed);
    });
  },
};
export default poll;
