/* eslint-disable linebreak-style */
const Card = require('../models/card');
const {
  ERROR_400_NAME,
  ERROR_404_NAME,
  ERROR_400_MESSAGE,
  ERROR_404_CARD_MESSAGE,
  ERROR_500_MESSAGE,
} = require('../utils/constants');

// GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: ERROR_500_MESSAGE }));
};

// POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === ERROR_400_NAME) {
        return res.status(400).send({ message: ERROR_400_MESSAGE });
      }
      return res.status(500).send({ message: ERROR_500_MESSAGE });
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error(ERROR_404_NAME))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === ERROR_404_NAME) {
        res.status(404).send({ message: ERROR_404_CARD_MESSAGE });
      } else if (err.name === ERROR_400_NAME) {
        res.status(400).send({ message: ERROR_400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { runValidators: true, new: true },
  )
    .orFail(new Error(ERROR_404_NAME, ERROR_404_CARD_MESSAGE))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === ERROR_404_NAME) {
        res.status(404).send({ message: ERROR_404_CARD_MESSAGE });
      } else if (err.name === ERROR_400_NAME) {
        res.status(400).send({ message: ERROR_400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error(ERROR_404_NAME))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === ERROR_404_NAME) {
        res.status(404).send({ message: ERROR_404_CARD_MESSAGE });
      } else if (err.name === ERROR_400_NAME) {
        res.status(400).send({ message: ERROR_400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
