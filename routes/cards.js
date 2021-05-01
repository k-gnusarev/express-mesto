/* eslint-disable linebreak-style */
const router = require('express').Router();
const { idValidation, cardValidation } = require('../middlewares/requestValidation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', cardValidation, createCard);
router.delete('/cards/:id', idValidation, deleteCard);
router.put('/cards/:id/likes', idValidation, likeCard);
router.delete('/cards/:id/likes', idValidation, unlikeCard);

module.exports = router;
