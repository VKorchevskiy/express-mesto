const User = require('../models/user');

const convertUser = (user) => {
  const convertedUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  };
  return convertedUser;
};

const throwUserNotFoundError = () => {
  const error = new Error('Пользователь не найден');
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.status(200).send(users.map((user) => convertUser(user))))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  const { userId: _id } = req.params;
  User
    .findById({ _id })
    .orFail(() => throwUserNotFoundError())
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      if (err.name === 'UserNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный _id для поиска пользователя.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchInfo = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => throwUserNotFoundError())
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'UserNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден (_id пользователя по заданию пока захардкожен и в другой базе не найдётся).' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchAvatar = (req, res) => {
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => throwUserNotFoundError())
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'UserNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден (_id пользователя по заданию пока захардкожен и в другой базе не найдётся).' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};
