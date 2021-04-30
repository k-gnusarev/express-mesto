/* eslint-disable linebreak-style */
const router = require('express').Router();
const { idValidation, userInfoValidation } = require('../middlewares/requestValidation');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', idValidation, getUser);
router.patch('/users/me', userInfoValidation, updateUserInfo);
router.patch('/users/me/avatar', userInfoValidation, updateUserAvatar);

module.exports = router;
