const { Message } = require('discord.js');
const Game = require('./card-game.js');
const { Card, suits, values } = require('../util/card.js');
const BotConfig = require('../config.js');

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

const BID_TIMEOUT = 10000;

/**
 * Get number of start cards based on number of players
 *
 * @param {number} playerCount number of players
 * @returns {number} number of cards per player for round 1
 */
function getStartCardsCount(playerCount) {
  if (playerCount < 6) return 10;
  if (playerCount === 6) return 8;
  if (playerCount === 7) return 7;
  return 0;
}

class OhHellGame extends Game {
  /**
   * Creates a game with given players and deck. Deal out the deck to the players evenly
   *
   * @param {object} config configuration for the game
   * @param {Message} config.message discord message
   * @param {number} config.startCardsPerPlayer Number of cards per player in round 1
   */
  constructor(config) {
    super(config);
    this.currentTrick = [];
    this.name = 'Oh Hell';
    this.trumps = '';
    this.stage = 'DESENDING';
    this.bids = new Map();
    this.players.forEach((player) => this.bids.set(player.userId, 0));

    // Deal out the starting cards
    this.players.forEach((player) => {
      for (let i = 0; i < config.startCardsPerPlayer; i += 1) {
        player.addCard(this.deck.pop());
      }
      player.hand.sort((a, b) => {
        if (a.suit === b.suit) return values.indexOf(b.value) - values.indexOf(a.value);
        return suits.indexOf(a.suit) - suits.indexOf(b.suit);
      });
    });
  }

  /**
   * Gets all bids for a given game round
   *
   * @param {object} config configuration for getting all bids this round
   * @param {Message} config.message discord message
   * @param {number} config.maxBid maximum bid a player can bid
   */
  async getRoundBids(config) {
    let bidsSum = 0;
    for (let i = 0; i < this.players.length; i += 1) {
      // last bid cannot be such that lastBid + bidsSum = maxBid
      let forbiddenBid = -1;
      if (i === this.players.length - 1) {
        forbiddenBid = config.maxBid - bidsSum;
      }

      // eslint-disable-next-line no-await-in-loop
      await this.getBid({
        message: config.message,
        maxBid: config.maxBid,
        playerId: this.players[i].userId,
        playerName: this.players[i].username,
        forbiddenBid,
      });

      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, BID_TIMEOUT));
      bidsSum += this.bids.get(this.players[i].userId);
    }
  }

  /**
   *
   * @param {object} config configuration for bidding
   * @param {Message} config.message discord message
   * @param {number} config.maxBid maximum bid a player can bid
   * @param {string} config.playerId ID of the player to get the bid from
   * @param {string} config.playerName Name of the player to get the bid from
   * @param {number} config.forbiddenBid Number that the player is not allowed to bid
   */
  async getBid(config) {
    this.bids.set(config.playerId, -1);

    // Find valid unicode emoji for bid
    const usedEmoji = [];
    const possibleEmoji = Object.keys(BotConfig.unicodeEmoji).map(
      (emoji) => BotConfig.unicodeEmoji[emoji],
    );
    for (let i = 0; i <= config.maxBid; i += 1) {
      usedEmoji.push(possibleEmoji[i]);
    }

    // Send message asking for bid. Add reaction collector
    const forbiddenBidMessage = config.forbiddenBid >= 0 ? `You cannot bid ${config.forbiddenBid}` : '';
    const bidMessage = await config.message.channel.send(`${config.playerName} please use a number react with your bid (0 - ${config.maxBid}). ${forbiddenBidMessage}`);
    const reactionCollector = bidMessage.createReactionCollector(
      (reaction, user) => usedEmoji.includes(reaction.emoji.name)
       && user.id === config.playerId, { time: BID_TIMEOUT },
    );

    // When active player reacts with number, set it as their bid and close popup
    reactionCollector.on('collect', (reaction) => {
      if (usedEmoji.includes(reaction.emoji.name)) {
        for (let i = 0; i <= config.maxBid; i += 1) {
          if (possibleEmoji[i] === reaction.emoji.name) {
            this.bids.set(config.playerId, i);
            break;
          }
        }
        reactionCollector.stop();
      }
    });

    // Delete bid message when bid gathered
    reactionCollector.on('end', () => {
      if (this.bids.get(config.playerId) === -1) {
        if (config.forbiddenBid === 0) this.bids.set(config.playerId, 1);
        else this.bids.set(config.playerId, 0);
      }
      config.message.channel.send(`${config.playerName} bid ${this.bids.get(config.playerId)}`);
      bidMessage.delete();
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
module.exports = { OhHellGame, getStartCardsCount };
