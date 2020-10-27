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
  }

  // Server stats command
  if (message.content === `${aloePrefix}serverstats`) {
    // Find number of bots in server
    const botCount = message.channel.members.reduce(
      (count, member) => (member.user.bot ? count + 1 : count), 0,
    );
    message.channel.send(`${message.guild.name} has ${Math.max(0, message.guild.memberCount - botCount)} people and ${botCount} bots \nAloeBot joined: ${message.guild.joinedAt.toDateString()}`);
  }
});

// Login the bot to discord. MUST BE LAST LINE
aloeBot.login(process.env.DISCORD_TOKEN);
