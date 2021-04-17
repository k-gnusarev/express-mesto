/* eslint-disable linebreak-style */
const ERROR_400_NAME = 'ValidationError';
const ERROR_404_NAME = 'CastError';
const ERROR_400_MESSAGE = 'Переданы некорректные данные.';
const ERROR_404_USER_MESSAGE = 'Пользователь по указанному _id не найден.';
const ERROR_404_CARD_MESSAGE = 'Карточка по указанному id не найдена.';
const ERROR_500_MESSAGE = 'Что-то пошло не так.';

module.exports = {
  ERROR_400_NAME,
  ERROR_404_NAME,
  ERROR_400_MESSAGE,
  ERROR_404_USER_MESSAGE,
  ERROR_404_CARD_MESSAGE,
  ERROR_500_MESSAGE,
};
