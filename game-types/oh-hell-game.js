const { Message } = require('discord.js');
const Game = require('./card-game.js');
const { Card } = require('../util/card.js');

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
  }

  /**
   * Play a given card from a given player if tey are the active player
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Card} config.card Card to play
   */
  playCard(config) {
    console.log(`playing card for Oh Hell:${this.activePlayer}`);
  }
}
module.exports = OhHellGame;
