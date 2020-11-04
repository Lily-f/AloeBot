const suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];
const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

/**
 * A card fron a standard card deck
 */
class Card {
  /**
   * Creates a card with a given suit and value.
   *
   * @param {object} config configuration for this card
   * @param {string} config.suit suit of the card
   * @param {string} config.value value of the card
   */
  constructor(config) {
    this.suit = config.suit;
    this.value = config.value;
  }
}
module.exports = { suits, values, Card };
