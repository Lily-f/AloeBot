const Player = require('./card-player.js');
const { Card } = require('./card.js');
const shuffle = require('./shuffle');
/**
 * A game of Cards
 */
class CardGame {
  /**
   * Creates a game with given players and deck. Deal out the deck to the players evenly
   *
   * @param {object} config configuration for the game
   * @param {Player[]} config.players players in teh game
   * @param {Card[]} config.deck deck of cards in the game
   */
  constructor(config) {
    this.deck = shuffle(config.deck);
    this.players = config.players;

    // Deal out cards
    const cardsPerPlayer = this.deck.length / this.players.length;
    this.players.forEach((player) => {
      for (let i = 0; i < cardsPerPlayer; i += 1) {
        player.addCard(this.deck.pop());
      }
    });
  }
}
module.exports = CardGame;
