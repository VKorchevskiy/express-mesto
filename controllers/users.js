const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const AuthError = require('../errors/auth-error');
const ConflictError = require('../errors/conflict-error');
const InvalidDataError = require('../errors/invalid-data-error');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'super-strong-secret';

const convertUser = (user) => {
  const convertedUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
    _id: user._id,
  };
  return convertedUser;
};

const processInvalidUserError = (err, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new InvalidDataError('Переданы некорректные данные пользователя.'));
  }
};

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.status(200).send(users.map((user) => convertUser(user))))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId: _id } = req.params;
  User
    .findById({ _id })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      processInvalidUserError(err, next);
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => res.status(200).send(convertUser(user)))
  .catch(next);

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          return next(new AuthError('Неправильные почта или пароль.'));
        }
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
          throw new ConflictError('Такой пользователь уже существует.');
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
        processInvalidUserError(error, next);
        next(error);
      });
  });
};

module.exports.patchInfo = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      processInvalidUserError(err, next);
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      processInvalidUserError(err, next);
      next(err);
    });
};
