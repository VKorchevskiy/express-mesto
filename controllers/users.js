const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const SALT_ROUNDS = 10;

const convertUser = (user) => {
  const convertedUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
    password: user.password,
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return { matched: bcrypt.compare(password, user.password), user };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      return res.status(200).send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          return res.status(409).send({ message: 'такой пользователь уже существует' });
        }
        return User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((userData) => res.status(200).send(convertUser(userData)));
      })
      .catch((error) => {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
          return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        }
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
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
