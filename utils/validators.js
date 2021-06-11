const { celebrate } = require('celebrate');
const Joi = require('joi');

const userValidator = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
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
    avatar: Joi.string(),
  }),
});

const cardSchemaValidator = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});

const IdValidator = celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  userValidator,
  patchUserInfoValidator,
  patchUserAvatarValidator,
  cardSchemaValidator,
  IdValidator,
};
