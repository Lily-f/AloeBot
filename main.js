import { Client, Collection } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './commands/load-commands.js';

// Add .env variables to the process. Used to obtain tokens
dotenv.config();

// Create Discord client (AloeBot) and load command files
const aloeBot = new Client();
aloeBot.commands = new Collection();
const aloePrefix = '^';
loadCommands().forEach((command) => { aloeBot.commands.set(command.name, command); });

// Responce to successful login once
aloeBot.once('ready', () => {
  console.log('Aloe ready!');
});

// Respond to messages
aloeBot.on('message', (message) => {
  if (!message.content.startsWith(aloePrefix) || message.author.bot) return;

  // Get command name and args from user
  const args = message.content.slice(aloePrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check command exists
  if (!aloeBot.commands.has(commandName)) return;
  const command = aloeBot.commands.get(commandName);

  // Check if command is guild only that message is in a guild
  if (command.guildOnly && message.channel.type === 'dm') {
    message.reply('I can\'t execute that command inside DMs!');
    return;
  }

  // Check that if command requires arguments, they are provided
  if (command.hasArgs && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: '${aloePrefix}${commandName} ${command.usage}'`;
    }
    message.channel.send(reply);
    return;
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
