import { Client } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const client = new Client();

client.once('ready', () => {
  console.log('Aloe is online!');
});

client.login(process.env.DISCORD_TOKEN);
