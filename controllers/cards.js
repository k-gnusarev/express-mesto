/* eslint-disable linebreak-style */
const Card = require('../models/card');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /cards — возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards — создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      throw new ValidationError(err.message);
    })
    .catch(next);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с данным ID не найдена');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку.');
      }

      Card.findByIdAndRemove(req.params.id)
        .then((data) => {
          res.send(data);
        })
        .catch(next);
    })
    .catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { runValidators: true, new: true },
  )
    .orFail(new Error('NullReturned'))
    .then((card) => res.send(card))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NullReturned'))
    .then((card) => res.send(card))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
