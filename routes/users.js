const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchInfo,
  patchAvatar,
} = require('../contollers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', patchInfo);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
