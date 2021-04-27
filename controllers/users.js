/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_400_NAME,
  ERROR_404_NAME,
  ERROR_400_MESSAGE,
  ERROR_404_USER_MESSAGE,
  ERROR_500_MESSAGE,
} = require('../utils/constants');

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: ERROR_500_MESSAGE }));
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error(ERROR_404_NAME, ERROR_404_USER_MESSAGE))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === ERROR_404_NAME) {
        res.status(404).send({ message: ERROR_404_USER_MESSAGE });
      } else if (err.name === ERROR_400_NAME) {
        res.status(400).send({ message: ERROR_400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

// POST /users — создаёт пользователя
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body; // извлекаем данные из тела запроса

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === ERROR_400_NAME) {
        return res.status(400).send({ message: ERROR_400_MESSAGE });
      }
      return res.status(500).send({ message: ERROR_500_MESSAGE });
    });
};

// PATCH /users/me/avatar — обновляет аватар
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.send(user.avatar))
    .catch((err) => {
      if (err.name === ERROR_400_NAME) {
        return res.status(400).send({ message: ERROR_400_MESSAGE });
      }
      return res.status(500).send({ message: ERROR_500_MESSAGE });
    });
};

// PATCH /users/me — обновляет профиль
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error(ERROR_404_NAME))
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case ERROR_400_NAME:
          return res.status(400).send({ message: ERROR_400_MESSAGE });
        case ERROR_404_NAME:
          return res.status(404).send({ message: ERROR_404_USER_MESSAGE });
        default:
          return res.status(500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
