const Player = require('./card-player.js');
const Card = require('./card.js');
/**
 * A game of Cards
 */
class CardGame {
  /**
   * @param {Player[]} players Players in the card game
   * @param {Card[]} deck Deck of cards  in the game
   */
  constructor(players, deck) {
    this.players = players;
    this.deck = deck;
  }
}
module.exports = CardGame;
