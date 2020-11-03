const server = require('./server.js');
const avatar = require('./avatar.js');
const help = require('./help.js');
const poll = require('./poll.js');
const strawpoll = require('./strawpoll.js');
const ping = require('./ping.js');
const userInfo = require('./user-info.js');

/**
 * Loads commands from thier respective files
 *
 * @returns {object} array of command objects
 */
module.exports = function loadCommands() {
  const commands = [];
  commands.push(avatar);
  commands.push(userInfo);
  commands.push(ping);
  commands.push(server);
  commands.push(help);
  commands.push(poll);
  commands.push(strawpoll);
  return commands;
};
