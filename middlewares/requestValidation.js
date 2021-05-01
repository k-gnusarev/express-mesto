/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// валидация ID
const idValidation = celebrate({
  params: Joi
    .object()
    .keys({
      id: Joi
        .string()
        .hex()
        .length(24),
    }),
});

// валидация инфо о пользователе
const userInfoValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки на аватар');
      }),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
});

// валидация данных карточки
const cardValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .required()
        .min(2)
        .max(30),
      link: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
            return value;
          }
          return helpers.message('Неправильный формат ссылки на картинку');
        }),
    }),
});

// валидация данных авторизации
const loginValidation = celebrate({
  body: Joi
    .object()
    .keys({
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .required()
        .min(8),
    }),
});

// валидация обновления информации о пользователе
const userInfoUpdateValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .required()
        .min(2)
        .max(30),
      about: Joi
        .string()
        .required()
        .min(2)
        .max(30),
    }),
  headers: Joi
    .object()
    .keys({
      'content-type': Joi
        .string()
        .valid('application/json')
        .required(),
    }),
});

// валидация обновления аватара
const userAvatarUpdateValidation = celebrate({
  body: Joi
    .object()
    .keys({
      avatar: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
            return value;
          }
          return helpers.message('Неправильный формат ссылки на аватар');
        }),
    }),
  headers: Joi
    .object()
    .keys({
      'content-type': Joi
        .string()
        .valid('application/json')
        .required(),
    }),
});

module.exports = {
  idValidation,
  userInfoValidation,
  cardValidation,
  loginValidation,
  userInfoUpdateValidation,
  userAvatarUpdateValidation,
};
