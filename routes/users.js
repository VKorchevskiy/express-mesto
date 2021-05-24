const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../contollers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);

module.exports = router;
