const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  // console.log('GET_USERS');
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  // console.log('GET_USER');
  const { userId: _id } = req.params;
  User.findById({ _id })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  // console.log('CREATE_USER');
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.patchInfo = (req, res) => {
  const { name, about } = req.body;
  // console.log('PATCH_INFO_USER');
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  // console.log('PATCH_AVATAR');
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
