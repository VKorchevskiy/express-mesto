class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidDataError';
  }
}

module.exports = InvalidDataError;
