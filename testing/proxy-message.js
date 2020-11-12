class ProxyMessage {
  constructor() {
    this.channel = { send: this.send };
  }

  /**
   * Send a given message
   *
   * @param {string} message message to display
   */
  // eslint-disable-next-line class-methods-use-this
  reply(message) {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  /**
   * Reply with a given message
   *
   * @param {string} message message to display
   */
  // eslint-disable-next-line class-methods-use-this
  send(message) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

module.exports = ProxyMessage;
