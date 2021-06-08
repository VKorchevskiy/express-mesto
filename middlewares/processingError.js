module.exports.processingError = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Переданы некорректные данные.';
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Пользователь с такой почтой уже есть.';
  }
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка.'
      : message,
  });
  next();
};
