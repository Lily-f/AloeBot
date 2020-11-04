const Message = require('discord.js');
const pollUtil = require('../util/poll-util.js');

const strawpoll = {
  name: 'strawpoll',
  aliases: [],
  description: 'Create a straw poll. Users have one vote',
  requiresArgs: true,
  usage: '"Topic name/description" [Poll time (minutes)] option1 option2 option3...\n\t\t\t eg: ^poll "Best animal" 0.2 cats dogs sheep pigs mice',
  guildOnly: true,
  cooldown: 5,
  /**
   * Create straw poll command
   *
   * @param {Message} message  user invocation message
   */
  async execute(message) {
    // Check bot has permission to manage messages. If it doesn't then can't use this command
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
      message.reply('I require permission to manage messages for this command!');
      return;
    }

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
    const userVotes = new Map();
    reactionCollector.on('collect', (reaction, user) => {
      if (usedEmoji.includes(reaction.emoji.name)) {
        // Check that each user only gets one vote
        if (!userVotes.has(user.id)) userVotes.set(user.id, reaction.emoji.name);
        const previousVote = userVotes.get(user.id);
        if (previousVote !== reaction.emoji.name) {
          optionFreq[previousVote].votes -= 1;
          userVotes.set(user.id, reaction.emoji.name);
          pollMessage.reactions.resolve(previousVote).users.remove(user.id);
        }
        optionFreq[reaction.emoji.name].votes += 1;
      }
    });

    // Update frequency when reacts removed
    reactionCollector.on('dispose', (reaction, user) => {
      if (usedEmoji.includes(reaction.emoji.name)) {
        optionFreq[reaction.emoji.name].votes -= 1;
        userVotes.delete(user.id);
      }
    });

    // Display embed of results when timeout occurs
    reactionCollector.on('end', () => {
      pollUtil.sendPollResults(message, pollMessage, optionFreq, topic);
    });
  },
};
module.exports = strawpoll;
