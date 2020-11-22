const { MessageEmbed, User } = require('discord.js');
const Player = require('../util/card-player.js');
const { Card, suits, values } = require('../util/card.js');
const shuffle = require('../util/shuffle.js');
const botConfig = require('../config.js');

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
   * @param {string} config.activePlayerId active player's ID
   * @param {string} config.activePlayerName active player's Name
   */
  constructor(config) {
    this.deck = shuffle(config.deck);
    this.players = config.players;
    this.activePlayerId = config.activePlayerId;
    this.activePlayerName = config.activePlayerName;

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
   * Display each players cards to the respective player
   *
   * @param {User[]} users discord users that are playing
   */
  displayCards(users) {
    const playerCards = new MessageEmbed()
      .setColor(botConfig.color)
      .setTitle('You\'ve started a Oh Hell game!');
    users.forEach((user) => {
      const playerHand = [];
      this.players.find((player) => player.userId === user.id).hand.forEach(
        (card) => { playerHand.push(card.toString()); },
      );
      user.send(playerCards.setDescription(`Your cards are: \n\`${playerHand.join(', ')}\``));
    });
  }
}
module.exports = CardGame;
