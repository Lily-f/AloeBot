const { Message } = require('discord.js');
const Game = require('../util/card-game.js');
const { Card } = require('../util/card.js');

class UpDownRiverGame extends Game {
/**
 * Play a given card from a given player if tey are the active player
 *
 * @param {object} config configuration for player and card being played
 * @param {Message} config.message message calling this function
 * @param {Card} config.card Card to play
 */
  playCard(config) {
    console.log(`playinging card for up and down the river:${this.activePlayer}`);
  }
}
module.exports = UpDownRiverGame;
