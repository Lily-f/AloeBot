const { User, Message } = require('discord.js');
const Player = require('../util/card-player.js');
const { Card } = require('../util/card.js');
const shuffle = require('../util/shuffle.js');

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
    this.name = '';
  }

  /**
   * Display each players cards to the respective player
   *
   * @param {User[]} users discord users that are playing
   */
  displayCards(users) {
    users.forEach((user) => {
      const playerHand = this.players.find((player) => player.userId === user.id).hand;
      user.send(`You Started a ${this.name} game!\nYour cards are: \n\`${playerHand.join(', ')}\``);
    });
  }

  /**
   * Add card to current trick and get next player
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Card} config.card Card to play
   * @param {Player} config.player player playing the card
   */
  rotatePlay(config) {
    config.message.reply(`${config.player.username} played \`${config.card.toString()}\``);
    this.currentTrick.push({ card: config.card, player: config.player });
    let nextPlayerIndex = this.players.findIndex((p) => p.userId === this.activePlayerId) + 1;
    if (nextPlayerIndex === this.players.length) nextPlayerIndex = 0;
    this.activePlayerId = this.players[nextPlayerIndex].userId;
    this.activePlayerName = this.players[nextPlayerIndex].username;
  }
}
module.exports = CardGame;
