const { Message, Channel } = require('discord.js');
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
    this.rotatePlay(config);

    // Handle the end of the trick
    if (this.currentTrick.length === this.players.length) {
      // Calculate winning play in trick
      let winningPlay = this.currentTrick[0];
      this.currentTrick.forEach((play) => {
        if (play.card.suit === winningPlay.card.suit
           && values.indexOf(play.card.value) > values.indexOf(winningPlay.card.value)) {
          winningPlay = play;
        }
      });

      // Set winner as next active player
      this.activePlayerId = winningPlay.player.userId;
      this.activePlayerName = winningPlay.player.username;

      // Find hearts in trick and display who won them
      this.displayWonHearts(config.message.channel, winningPlay);
      this.currentTrick = [];

      // Handle if that was the last card in the game
      this.handleEnding(config);
    }
    return true;
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

  /**
   * Handle ending of the game, if appropriate
   *
   * @param {object} config configuration for player and card being played
   * @param {Message} config.message message calling this function
   * @param {Player} config.player player playing the card
   */
  handleEnding(config) {
    if (config.player.hand.length === 1) {
      let scoresMessage = '';
      this.players.forEach((player) => {
        let score = 0;
        player.wonCards.forEach((card) => {
          score += values.indexOf(card.value) + 2;
        });
        scoresMessage += `${player.username}: ${score}\n`;
      });
      config.message.channel.send(`GAME OVER. Scores are:\n${scoresMessage}`);
    }
  }

  /**
   * Calculate and display hearts won in the current trick
   *
   * @param {Channel} channel channel to display results
   * @param {object} winningPlay card and player of the tricks winning play
   */
  displayWonHearts(channel, winningPlay) {
    const heartsThisTrick = [];
    this.currentTrick.forEach((play) => {
      if (play.card.suit === 'HEARTS') {
        winningPlay.player.wonCards.push(play.card);
        heartsThisTrick.push(play.card);
      }
    });
    if (heartsThisTrick.length) {
      channel.send(`${winningPlay.player.username} has won ${heartsThisTrick}`);
    } else {
      channel.send(`${winningPlay.player.username} won the trick. No hearts gained`);
    }
  }
}
module.exports = HeartsGame;
