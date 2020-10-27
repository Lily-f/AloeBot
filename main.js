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
  // Echo command
  if (message.content.split(' ')[0] === `${aloePrefix}echo`) {
    message.channel.send(message.content.substring(6, message.content.length));
  } else if (message.content === `${aloePrefix}ping`) {
    message.channel.send('pong');
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
