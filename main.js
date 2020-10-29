import { Client, Collection, Message } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './commands/load-commands.js';
import config from './config.js';

// Add .env variables to the process. Used to obtain tokens
dotenv.config();

// Create Discord client (AloeBot) and run setup
const aloeBot = new Client();
aloeBot.commands = new Collection();
// const prefix = '^';
loadCommands().forEach((command) => { aloeBot.commands.set(command.name, command); });
const cooldowns = new Collection();

// Responce to successful login once
aloeBot.once('ready', () => {
  // TODO: remove logging
  // eslint-disable-next-line no-console
  console.log('Aloe ready!');
  aloeBot.user.setStatus('online');
  aloeBot.user.setActivity('paint dry', { type: 'WATCHING' });
});

/**
 * Check if a command was used with the correct arguments
 * If command used without required args, give example usage
 *
 * @param {object} command command invoked by the user
 * @param {Message} message message user sent
 * @param {string[]} args arguments in users message
 * @returns {boolean} were argument requirements meet
 */
const checkCommandArgs = (command, message, args) => {
  if (command.requiresArgs && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: '${config.prefix}${command.name} ${command.usage}'`;
    }
    message.channel.send(reply);
    return true;
  }
  return false;
};

/**
 * Check if the command invoked is still in cooldown
 * Starts command cooldown if it has one
 * Message user if still in cooldown
 *
 * @param {Message} message message user sent
 * @param {object} command command invoked by user
 * @returns {boolean} is command still in cooldown
 */
const handleCommandCooldown = (message, command) => {
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  // If user has used command, check if cooldown has expired
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    // Alert user if cooldown is not over
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      return true;
    }
  }

  // Set cooldown for command
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  return false;
};

// Subscribe and respond to messages
aloeBot.on('message', (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // Get command name and args from user
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check command exists
  const command = aloeBot.commands.get(commandName)
   || aloeBot.commands.find((cmd) => cmd.aliases.includes(commandName));
  if (!command) return;

  // Check if command is guild only that message is in a guild
  if (command.guildOnly && message.channel.type === 'dm') {
    message.reply('I can\'t execute that command inside DMs!');
    return;
  }

  // Check that if command requires arguments, they are provided
  if (checkCommandArgs(command, message, args)) return;

  // Check command has a cooldown
  if (handleCommandCooldown(message, command)) return;

  try {
    command.execute(message, args);
  } catch (error) {
    // TODO: remove logging
    // eslint-disable-next-line no-console
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
