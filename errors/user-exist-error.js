class UserExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'userExistError';
  }
}

module.exports = UserExistError;
