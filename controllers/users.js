const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.send({ message: err.message }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
