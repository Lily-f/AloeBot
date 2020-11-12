const { Message } = require('discord.js');
const Game = require('./card-game.js');
const { Card, values } = require('../util/card.js');
const Player = require('../util/card-player.js');

class HeartsGame extends Game {
  /**
   * Creates a game with given players and deck. Deal out the deck to the players evenly
   *
   * @param {object} config configuration for the game
   */
  constructor(config) {
    super(config);
    this.currentTrick = [];
  }

  /**
   * Play a given card from a given player if they are the active player.
   * If it is the last card in the trick then give any hearts to the winner
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Card} config.card Card to play
   * @param {Player} config.player player playing the card
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
    config.message.reply(`You played \`${config.card.toString()}\``);
    this.currentTrick.push({ card: config.card, player: config.player });
    let nextPlayerIndex = this.players.findIndex((p) => p.userId === this.activePlayerId) + 1;
    if (nextPlayerIndex === this.players.length) nextPlayerIndex = 0;
    this.activePlayerId = this.players[nextPlayerIndex].userId;
    this.activePlayerName = this.players[nextPlayerIndex].username;

    // Handle the end of the trick
    if (this.currentTrick.length === this.players.length) {
      let winningPlay = this.currentTrick[0];
      this.currentTrick.forEach((play) => {
        if (play.card.suit === winningPlay.card.suit
           && values.indexOf(play.card.value) > values.indexOf(winningPlay.card.value)) {
          winningPlay = play;
        }
      });

      this.activePlayerId = winningPlay.player.userId;
      this.activePlayerName = winningPlay.player.username;

      this.currentTrick.forEach((play) => {
        if (play.card.suit === 'HEARTS') {
          winningPlay.player.wonCards.push(play.card);
        }
      });
      if (winningPlay.player.wonCards.length) {
        config.message.channel.send(`${winningPlay.player.username} has won ${winningPlay.player.wonCards}`);
      } else {
        config.message.channel.send(`${winningPlay.player.username} won the trick. No hearts`);
      }

      // Handle if that was the last card in the game
      if (config.player.hand.length === 1) {
        const scores = new Map();
        this.players.forEach((player) => {
          scores.set(player.userId, 0);
          player.wonCards.forEach((card) => {
            scores.set(player.userId, scores.get(player.userId) + values.indexOf(card.value) + 2);
          });
        });
        config.message.channel.send(`GAME OVER\nScores are: ${JSON.stringify(scores)}`);
      }
    }
    return true;
  }
}
module.exports = HeartsGame;
