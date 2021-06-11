const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardSchemaValidator, IdValidator } = require('../utils/validators');

router.get('/', getCards);
router.post('/', cardSchemaValidator, createCard);
router.delete('/:cardId', IdValidator, deleteCardById);
router.put('/:cardId/likes', IdValidator, likeCard);
router.delete('/:cardId/likes', IdValidator, dislikeCard);

module.exports = router;
