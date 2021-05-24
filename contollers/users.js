const User = require('../models/user');

var c =1;

module.exports.getUsers = (req, res) => {
  console.log('GET_USERS')
  User.find({})
    .then(users => {
      res.status(200).send({ data: users });
      console.log(users)
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  console.log('GET_USER')
  const { userId: _id } = req.params;
  User.findById({_id})
    .then(users => res.status(200).send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  console.log(req.body)
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

