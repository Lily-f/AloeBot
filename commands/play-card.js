const Message = require('discord.js');
const { suits, values } = require('../util/card.js');

const playCard = {
  name: 'play-card',
  aliases: [],
  description: 'Play a card for an ongoing game',
  requiresArgs: true,
  usage: '<Suit> <Value>',
  guildOnly: true,
  cooldown: 0,
  /**
   * Play card command. Handles when a user plays a card for a game
   *
   * @param {Message} message user invocation message
   * @param {string[]} args user given arguments for the comand
   */
  execute(message, args) {
    const suit = args[0].toUpperCase();
    const value = args[1].toUpperCase();

    // Get game user is in and corresponding Player instance
    let player;
    const game = message.client.games.find((g) => g.players.some((p) => {
      if (p.userId === message.author.id) {
        player = p;
        return true;
      }
      return false;
    }));
    if (!game) {
      message.reply('You\'re not in a card game!');
      return;
    }

    // Check arguments form a valid card
    if (!suits.includes(suit) || !values.includes(value)) {
      message.reply(`Invalid Card! requires: ${this.usage}`);
      return;
    }

    // Check the user has the card being played
    const card = player.getCard(suit, value);
    if (!card) {
      message.reply('You don\'t have that card in your hand!');
      return;
    }

    // Play the card
    game.playCard({ message, card, userId: message.author.id });
  },
};
module.exports = playCard;
