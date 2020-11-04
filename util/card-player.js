const { Card } = require('./card.js');
/**
 * A player in a card game
 */
class Player {
  /**
   * Create a player with a given hand.
   *
   * @param {object} config configuration for the player
   * @param {string} config.username Discord username of the player
   */
  constructor(config) {
    this.hand = [];
    this.wonCards = [];
    this.username = config.username;
  }

  /**
   * Give this player thier cards
   *
   * @param {Card[]} hand cards for the players hand
   */
  setHand(hand) {
    this.hand = hand;
  }
}
module.exports = Player;
