const suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];
const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

/**
 * A card fron a standard card deck
 */
class Card {
  /**
   * Creates a card with a given suit and value.
   *
   * @param {string} suit suit this card has
   * @param {string} value value this card has
   */
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}
module.exports = { suits, values, Card };
