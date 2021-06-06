const router = require('express').Router();
const {
  getUsers,
  getUserById,
  patchInfo,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', patchInfo);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
