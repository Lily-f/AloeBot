const Card = require('./card.js');
/**
 * A player in a card game
 */
class Player {
  /**
   * Create a player with a given hand.
   *
   * @param {object} config configuration for the player
   * @param {Card[]} config.hand cards in the players hand
   */
  constructor(config) {
    this.hand = config.hand;
    this.wonCards = [];
  }
}
module.exports = Player;
