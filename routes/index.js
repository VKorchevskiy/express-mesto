const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
