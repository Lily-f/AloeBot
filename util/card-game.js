const Player = require('./card-player.js');
const Player = require('./card-player.js');
const Card = require('./card.js');
/**
 * A game of Cards
 */
class CardGame {
  /**
   * @param {object} config configuration for the game
   * @param {Player[]} config.players players in teh game
   * @param {Card[]} config.deck deck of cards in the game
   */
  constructor(config) {
    this.players = config.players;
    this.deck = config.deck;
  }
}
module.exports = CardGame;
