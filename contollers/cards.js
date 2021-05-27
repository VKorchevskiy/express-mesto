const Card = require('../models/card');

const convertCard = (card) => {
  const collectedCard = {
    likes: card.likes,
    _id: card._id,
    name: card.name,
    link: card.link,
    owner: card.owner,
    createdAt: card.createdAt,
  };
  return collectedCard;
};

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => {
      res.status(200).send(cards.map((card) => convertCard(card)));
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId: _id } = req.params;
  Card
    .deleteOne({ _id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card
    .create({
      name,
      link,
      owner: req.user._id,
      createdAt: Date.now(),
    })
    .then((card) => res.status(201).send(convertCard(card)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.status(200).send(convertCard(card)))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.status(200).send(convertCard(card)))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.' });
  });
