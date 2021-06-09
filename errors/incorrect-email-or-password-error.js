class CncorrectEmailOrPasswordError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'incorrectEmailOrPasswordError';
  }
}

module.exports = CncorrectEmailOrPasswordError;