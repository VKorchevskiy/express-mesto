const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const InvalidDataError = require('../errors/invalid-data-error');

const convertCard = (card) => {
  const convertedCard = {
    likes: card.likes,
    _id: card._id,
    name: card.name,
    link: card.link,
    owner: card.owner,
    createdAt: card.createdAt,
  };
  return convertedCard;
};

const processInvalidCardError = (err, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new InvalidDataError('Переданы некорректные данные карточки.'));
  }
};

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.status(200).send(cards.map((card) => convertCard(card))))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId: _id } = req.params;

  Card.findById({ _id })
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if ((req.user._id.toString()) !== (card.owner._id).toString()) {
        throw new ForbiddenError('Нельзя удалять чужие карточки.');
      }
      card.deleteOne();
      return res.status(200).send({ message: `Карточка с _id - ${_id} удалена.` });
    })
    .catch((err) => {
      processInvalidCardError(err, next);
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card
    .create({
      name,
      link,
      owner: req.user._id,
    })
    .then((card) => res.status(201).send(convertCard(card)))
    .catch((err) => {
      processInvalidCardError(err, next);
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
  .then((card) => res.status(200).send(convertCard(card)))
  .catch((err) => {
    processInvalidCardError(err, next);
    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
  .then((card) => res.status(200).send(convertCard(card)))
  .catch((err) => {
    processInvalidCardError(err, next);
    next(err);
  });
