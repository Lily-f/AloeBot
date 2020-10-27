import { Client } from 'discord.js';
import dotenv from 'dotenv';

// Add .env variables to the process. Used to obtain tokens
dotenv.config();
const aloeBot = new Client();
const aloePrefix = '^';

// Responce to successful login once
aloeBot.once('ready', () => {
  console.log('Aloe online!');
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
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
