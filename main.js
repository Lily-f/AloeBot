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

  // Get command and args from user
  const args = message.content.slice(aloePrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // If the command is valid, try execute it. Reply with errors on exceptions
  if (!aloeBot.commands.has(command)) return;
  try {
    aloeBot.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
