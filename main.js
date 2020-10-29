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

  const args = message.content.slice(aloePrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Echo command
  if (command === 'echo') {
    if (args.toString().length > 0) {
      message.channel.send(args.toString());
    }
  } else if (message.content === `${aloePrefix}ping`) {
    message.channel.send('pong');
  } else if (message.content === `${aloePrefix}server`) {
    message.channel.send(`This server is called ${message.guild.name}\n
      Total members: ${message.guild.memberCount}`);
  } else if (message.content === `${aloePrefix}my-info`) {
    message.channel.send(`Your username: ${message.author.username}\n
      Your ID: ${message.author.id}`);
  } else if (command === 'avatar') {
    if (!message.mentions.users.size) {
      message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`);
    } else {
      const avatarList = message.mentions.users.map((user) => `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`);
      message.channel.send(avatarList);
    }
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
