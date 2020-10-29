const userInfo = {
  name: 'user-info',
  description: 'See your Discord info',
  execute(message, args) {
    message.channel.send(`Your username: ${message.author.username}\n
        Your ID: ${message.author.id}`);
  },
};
export default userInfo;
