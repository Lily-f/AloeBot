module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(message, args) {
    message.channel.send(`Your username: ${message.author.username}\n
        Your ID: ${message.author.id}`);
  },
};
