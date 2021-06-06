const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  patchInfo,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', patchInfo);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
