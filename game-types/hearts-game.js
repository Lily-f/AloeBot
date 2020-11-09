const { Message } = require('discord.js');
const Game = require('../util/card-game.js');
const { Card } = require('../util/card.js');

class HeartsGame extends Game {
  /**
   * Play a given card from a given player if tey are the active player
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Card} config.card Card to play
   */
  playCard(config) {
    if (config.message.author.id !== this.activePlayerId) {
      config.message.reply(`${this.activePlayerName} is the active player, not you!`);
      return;
    }
    config.message.reply(`You played \`${config.card.toString()}\``);
  }
}
module.exports = HeartsGame;
