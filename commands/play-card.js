const Message = require('discord.js');
const HeartsGame = require('../game-types/hearts-game.js');
const CardGame = require('../util/card-game.js');
const UpDownRiverGame = require('../game-types/up-down-river-game.js');

const playCard = {
  name: 'play-card',
  aliases: [],
  description: 'Play a card for an ongoing game',
  requiresArgs: true,
  usage: '',
  guildOnly: true,
  cooldown: 0,
  /**
   * Play card command. Handles when a user plays a card for a game
   *
   * @param {Message} message user invocation message
   * @param {string[]} args user given arguments for the comand
   */
  execute(message, args) {
    // Get game user is in
    const game = message.client.games.get(message.author.id);
    if (!game) {
      message.reply('You\'re not in a card game!');
      return;
    }

    // TODO: get the user and card being played

    // TODO: Check the user has the card being played
    // TODO: Play the card based on the gametype the user is playing
    if (game instanceof HeartsGame) {
      message.reply('You\'re playing hearts!');
    } else if (game instanceof UpDownRiverGame) {
      message.reply('You\'re playing Up and Down the River');
    }
  },
};
module.exports = playCard;
