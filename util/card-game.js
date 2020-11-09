const { Message } = require('discord.js');
const Player = require('./card-player.js');
const { Card, suits, values } = require('./card.js');
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
   * @param {string} config.activePlayer active player's ID
   */
  constructor(config) {
    this.deck = shuffle(config.deck);
    this.players = config.players;
    this.activePlayer = config.activePlayer;

    // Deal out cards and sort hands for readability
    const cardsPerPlayer = this.deck.length / this.players.length;
    this.players.forEach((player) => {
      for (let i = 0; i < cardsPerPlayer; i += 1) {
        player.addCard(this.deck.pop());
      }
      player.hand.sort((a, b) => {
        if (a.suit === b.suit) return values.indexOf(b.value) - values.indexOf(a.value);
        return suits.indexOf(a.suit) - suits.indexOf(b.suit);
      });
    });
  }

  /**
   * Play a given card from a given player if tey are the active player
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   */
  playCard(config) {
    if (config.message.author.id !== this.activePlayer) {
      console.log(`${config.message.author.id} is not the active player`);
      return;
    }
    console.log(`Active player ${config.message.author.id} is playing a card`);
  }
}
module.exports = CardGame;
