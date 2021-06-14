const { celebrate } = require('celebrate');
const Joi = require('joi');
const validator = require('validator');
const InvalidDataError = require('../errors/invalid-data-error');

const validateUrl = (url) => {
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new InvalidDataError('Переданы некорректные данные.');
  }
  return url;
};

const userValidator = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const patchUserInfoValidator = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const patchUserAvatarValidator = celebrate({
  body: Joi.object({
    avatar: Joi.string().required().custom(validateUrl),
  }),
});

const userIdValidator = celebrate({
  params: Joi.object({
    userId: Joi.string().length(24).hex(),
  }),
});

const cardSchemaValidator = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
  }),
});

const cardIdValidator = celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  userValidator,
  patchUserInfoValidator,
  patchUserAvatarValidator,
  userIdValidator,
  cardSchemaValidator,
  cardIdValidator,
};
