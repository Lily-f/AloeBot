const Discord = require('discord.js');
// import Discord from 'discord.js';

require('dotenv').config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Aloe is online!');
});

client.login(process.env.DISCORD_TOKEN);
