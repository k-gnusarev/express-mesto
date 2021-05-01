/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  idValidation,
  userAvatarUpdateValidation,
  userInfoUpdateValidation,
} = require('../middlewares/requestValidation');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', idValidation, getCurrentUser);
router.get('/users/:id', idValidation, getUser);
router.patch('/users/me', userInfoUpdateValidation, updateUserInfo);
router.patch('/users/me/avatar', userAvatarUpdateValidation, updateUserAvatar);

module.exports = router;
