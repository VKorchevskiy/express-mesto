const User = require('../models/user');

const convertUser = (user) => {
  const collectedUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  };
  return collectedUser;
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users.map((user) => convertUser(user)));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId: _id } = req.params;
  User.findById({ _id })
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.patchInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.patchAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => res.status(200).send(convertUser(user)))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
