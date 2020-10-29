import config from '../config.js';

const help = {
  name: 'help',
  aliases: ['commands'],
  description: 'List all of my commands or info about a specific command.',
  requiresArgs: false,
  usage: '[command name]',
  guildOnly: false,
  cooldown: 5,
  execute(message, args) {
    const response = [];
    const { commands } = message.client;

    // If user doesn't want help with a specific command, list all of them
    if (!args.length) {
      response.push('Here\'s a list of all my commands:');
      response.push(commands.map((command) => command.name).join(', '));
      response.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);

      // Try to send help message as a DM. Alert user if can't
      message.author.send(response, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('I\'ve sent you a DM with all my commands!');
        })
        .catch((error) => {
          // TODO: remove logging
          // eslint-disable-next-line no-console
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('it seems like I can\'t DM the commands to you! Do you have DMs disabled?');
        });
      return;
    }

    // Give information about a specific command
    // Check valid command
    const name = args[0].toLowerCase();
    const command = commands.get(name)
        || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
    if (!command) {
      message.reply('that\'s not a valid command!');
      return;
    }

    // Send command info to chennel user asked, not DM
    response.push(`**Name:** ${command.name}`);
    if (command.aliases && command.aliases.length) response.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description) response.push(`**Description:** ${command.description}`);
    if (command.usage) response.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
    response.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    message.channel.send(response, { split: true });
  },
};
export default help;
