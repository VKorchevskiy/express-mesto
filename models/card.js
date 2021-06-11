const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/{2}[a-z0-9\-._~:\\/?#[\]@!$&'()*+,;=]+#?/g.test(v),
      message: (props) => `${props.value} ссылка некорректная.`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('card', cardSchema);
