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
   * @param {string} config.userId Discord ID of the user
   */
  constructor(config) {
    this.hand = [];
    this.wonCards = [];
    this.username = config.username;
    this.userId = config.userId;
  }

  /**
   * Give this player a card
   *
   * @param {Card[]} card card for the players hand
   */
  addCard(card) {
    this.hand.push(card);
  }

  /**
   * Get a card from this players hand
   *
   * @param {string} suit card suit
   * @param {string} value card value
   * @returns {boolean} does this players hand contain this card
   */
  getCard(suit, value) {
    const cardIndex = this.hand.findIndex((card) => card.suit === suit && card.value === value);
    if (cardIndex === -1) return undefined;
    return this.hand[cardIndex];
  }

  /**
   * Remove a given card from players hand
   *
   * @param {Card} card card to remove
   */
  removeCard(card) {
    this.hand.splice(this.hand.indexOf(card), 1);
  }
}
module.exports = Player;
