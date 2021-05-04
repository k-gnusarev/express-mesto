/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

function handleErrors(err) {
  if (err.message === 'NullReturned' || err.name === 'CastError') {
    throw new NotFoundError(err.message);
  } else {
    throw new ValidationError(err.message);
  }
}

// GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('NullReturned'))
    .then((user) => res.send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// POST /users — создаёт пользователя
const createUser = (req, res, next) => {
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
    .then((user) => res.send({ // записываем данные пользователя в ответ и отправляем его
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(err.message);
      }

      throw new ValidationError(err.message);
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new Error('NullReturned'))
    .then((user) => res.send(user.avatar))
    .catch((err) => handleErrors(err))
    .catch(next);
};

// PATCH /users/me — обновляет профиль
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('NullReturned'))
    .then((user) => res.send(user))
    .catch((err) => handleErrors(err))
    .catch(next);
};

// GET users/me — выдаёт текущего пользователя
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id) // поиск пользователя
    .orFail(new Error('NullReturned'))
    .then((user) => res.send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password') // вернуть хеш пароля при авторизации
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // пользователь найден
      return bcrypt.compare(password, user.password).then((matched) => {
        // проверка соответствия хеша пароля с базой
        if (!matched) {
          // хеши не совпали — отклоняем промис
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      // выдать токен
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
  login,
};
