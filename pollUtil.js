import { Message, MessageEmbed } from 'discord.js';
import config from './config.js';
/**
 * Loads parameters for the poll from message.
 * Creates object and string representations of options and their frequencies.
 *
 * @param {Message} message discord message calling a poll command
 * @returns {object} false if not valid poll, else object with poll emoji, options, topic, timeout
 */
function loadPollArguments(message) {
  // Find topic, determined by two quotes in the mesasge
  const matches = message.content.match(/"/g);
  const quotesNumber = matches ? matches.length : 0;
  if (quotesNumber < 2) {
    message.reply('Poll topic command requires at least 2 double quote marks!');
    return false;
  }
  const topic = message.content.substring(message.content.indexOf('"') + 1, message.content.lastIndexOf('"'));

  // Get and check arguments for the command
  const messageAfterTopic = message.content.substring(message.content.lastIndexOf('"') + 1);
  const args = messageAfterTopic.trim().split(/ +/);
  const timeout = parseFloat(args[0], 10);
  if (Number.isNaN(timeout) || timeout <= 0) {
    message.reply('Timeout needs to be a number greater than 0!');
    return false;
  }
  const options = args.slice(1, args.length);
  if (options.length < 2 || options.length > 20) {
    message.reply('Poll must have between 2 and 20 options!');
    return false;
  }

  // Create string representing options and object for frequencies
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

  return {
    topic, optionFreq, optionsString, usedEmoji, timeout,
  };
}

/**
 * Sends poll embed with poll information
 *
 * @param {Message} message discord message calling a poll command
 * @param {string} topic topic of poll
 * @param {string[]} usedEmoji array of emoji to tally
 * @param {number} timeout number of minutes poll runs for
 * @param {string} optionsString String to display the options and corresponding emoji
 * @returns {object} Reaction collector for poll embed and the embed itself
 */
async function sendPollMessage(message, topic, usedEmoji, timeout, optionsString) {
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
  return { reactionCollector, pollMessage };
}

/**
 * Sends an embedded message containing the results of the poll and deletes the original poll
 *
 * @param {Message} message discord message calling a poll command
 * @param {Message} pollMessage Poll message with reactions
 * @param {object} optionFreq object containing tallied reactions, option description, and frequency
 * @param {string} topic topic of poll
 */
function sendPollResults(message, pollMessage, optionFreq, topic) {
  pollMessage.delete();
  let results = '';
  Object.values(optionFreq).forEach((option) => { results += `${option.option} - ${option.votes}\n`; });
  const resultsEmbed = new MessageEmbed()
    .setColor(config.color)
    .setTitle(`Poll - ${topic} is Finished!`)
    .setDescription(`${results}`)
    .setFooter(`Poll created by ${message.author.username}`);
  message.channel.send(resultsEmbed);
}

export default { loadPollArguments, sendPollMessage, sendPollResults };
