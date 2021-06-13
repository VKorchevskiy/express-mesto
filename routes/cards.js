const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardSchemaValidator, cardIdValidator } = require('../utils/validators');

router.get('/', getCards);
router.post('/', cardSchemaValidator, createCard);
router.delete('/:cardId', cardIdValidator, deleteCardById);
router.put('/:cardId/likes', cardIdValidator, likeCard);
router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
