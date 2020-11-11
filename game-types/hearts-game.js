const { Message } = require('discord.js');
const Game = require('./card-game.js');
const { Card } = require('../util/card.js');

class HeartsGame extends Game {
  /**
   * Creates a game with given players and deck. Deal out the deck to the players evenly
   *
   * @param {object} config configuration for the game
   */
  constructor(config) {
    super(config);
    this.currentTrick = [];
  }

  /**
   * Play a given card from a given player if they are the active player.
   * If it is the last card in the trick then give any hearts to the winner
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Card} config.card Card to play
   * @param {string} config.userId ID of user playing the card
   */
  playCard(config) {
    if (config.userId !== this.activePlayerId) {
      config.message.reply(`${this.activePlayerName} is the active player, not you!`);
      return;
    }
    config.message.reply(`You played \`${config.card.toString()}\``);
    this.currentTrick.push(config.card);

    // Handle the end of the trick
    if (this.currentTrick.length === this.players.length) {
      config.message.send('Last card in the trick!');
    }
  }
}
module.exports = HeartsGame;
