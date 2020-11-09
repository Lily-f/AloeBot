const suits = ['HEARTS', 'SPADES', 'DIAMONDS', 'CLUBS'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];

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

  /**
   * Get string representation of card
   *
   * @returns {string} String of card
   */
  toString() {
    let prefix = '';
    switch (this.suit) {
      case 'HEARTS':
        prefix = '♥';
        break;
      case 'SPADES':
        prefix = '♠';
        break;
      case 'DIAMONDS':
        prefix = '♦';
        break;
      case 'CLUBS':
        prefix = '♣';
        break;
      default:
        break;
    }
    return `${prefix}${this.value}`;
  }
}

/**
 * Generates a deack with all 52 cards
 *
 * @param {object[]} cardsToSkip cards to not put in the deck
 * @returns {Card[]} deck of cards
 */
function generateDeck(cardsToSkip) {
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      // Add each type of card to the deck except the ones that should be skipped
      let skip = false;
      cardsToSkip.forEach((card) => {
        if (card.suit === suit && card.value === value) { skip = true; }
      });
      if (!skip) {
        deck.push(new Card({ suit, value }));
      }
    });
  });
  return deck;
}
module.exports = {
  suits, values, Card, generateDeck,
};
