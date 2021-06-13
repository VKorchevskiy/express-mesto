const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  patchInfo,
  patchAvatar,
} = require('../controllers/users');
const { patchUserInfoValidator, patchUserAvatarValidator, userIdValidator } = require('../utils/validators');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidator, getUserById);
router.patch('/me', patchUserInfoValidator, patchInfo);
router.patch('/me/avatar', patchUserAvatarValidator, patchAvatar);

module.exports = router;
