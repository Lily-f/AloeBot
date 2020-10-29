import userInfo from './user-info.js';
import ping from './ping.js';
import server from './server.js';
import avatar from './avatar.js';
import help from './help.js';

/**
 * Loads commands from
 *
 * @returns {object} array of command objects
 */
export default function loadCommands() {
  const commands = [];
  commands.push(avatar);
  commands.push(userInfo);
  commands.push(ping);
  commands.push(server);
  commands.push(help);
  return commands;
}
