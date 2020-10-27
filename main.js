import { Client } from 'discord.js';
import dotenv from 'dotenv';

// Add .env variables to the process. Used to obtain tokens
dotenv.config();
const aloeBot = new Client();
const aloePrefix = '^';

// Responce to successful login once
aloeBot.once('ready', () => {
  console.log('Aloe online!');
  console.log(aloeBot.user.id);
});

// Respond to messages
aloeBot.on('message', (message) => {
  // Only respond with the right prefix
  if (!message.content.startsWith(aloePrefix)) return;
  message.channel.send(message.content.substring(1, message.content.length));
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
