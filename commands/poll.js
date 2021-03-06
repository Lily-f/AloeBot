const Message = require('discord.js');
const pollUtil = require('../util/poll-util.js');

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
    // load poll arguments from users message. Create options string and frequency object
    const pollArgs = pollUtil.loadPollArguments(message);
    if (!pollArgs) return;
    const {
      topic, usedEmoji, timeout, optionFreq, optionsString,
    } = pollArgs;

    // Send poll message and create reaction collector
    const { reactionCollector, pollMessage } = await pollUtil.sendPollMessage(message, topic,
      usedEmoji, timeout, optionsString);

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
      pollUtil.sendPollResults(message, pollMessage, optionFreq, topic);
    });
  },
};
module.exports = poll;
