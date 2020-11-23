const { Message } = require('discord.js');
const Game = require('./card-game.js');
const { Card, suits, values } = require('../util/card.js');
const shuffle = require('../util/shuffle.js');

const STAGES = {
  ACENDING: 1,
  DECENDING: 2,
  FINISHED: 3,
};
Object.freeze(STAGES);

const CARDS_ON_SIZE = {
  3: 10,
  4: 10,
  5: 10,
  6: 8,
  7: 7,
};
Object.freeze(CARDS_ON_SIZE);

class OhHellGame extends Game {
  /**
   * Creates a game with given players and deck. Deal out the deck to the players evenly
   *
   * @param {object} config configuration for the game
   */
  constructor(config) {
    super(config);
    this.currentTrick = [];
    this.name = 'Oh Hell';
    this.trumps = '';
    this.stage = 'DESENDING';

    // Deal out the starting cards
    let cardsPerPlayer;
    if (this.players.length < 6) {
      cardsPerPlayer = 10;
    } else if (this.players.length === 6) {
      cardsPerPlayer = 8;
    } else if (this.players.length === 7) {
      cardsPerPlayer = 7;
    }
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
   * @param {Card} config.card Card to play
   * @returns {boolean} true if valid card play else false
   */
  playCard(config) {
    // Check the player is the next active player
    if (config.player.userId !== this.activePlayerId) {
      config.message.reply(`${this.activePlayerName} is the active player, not you!`);
      return false;
    }

    // Check the player is following the suit if they can
    if (this.currentTrick.length > 0 && config.card.suit !== this.currentTrick[0].card.suit
      && config.player.hand.some((c) => c.suit === this.currentTrick[0].card.suit)) {
      config.message.reply(`You didn't follow suit! Play ${this.currentTrick[0].card.suit}`);
      return false;
    }

    // Add played card to current trick, set next player to active
    this.rotatePlay(config);

    // Handle the end of the trick
    if (this.currentTrick.length === this.players.length) {
      console.log('end of trick!');
    }
    return true;
  }
}
module.exports = OhHellGame;
