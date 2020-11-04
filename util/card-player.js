const Card = require('./card.js');
/**
 * A player in a card game
 */
class Player {
  /**
   * Create a player with a given hand.
   *
   * @param {Card[]} hand Cards in players hand
   */
  constructor(hand) {
    this.hand = hand;
    this.wonCards = [];
  }
}
module.exports = Player;
