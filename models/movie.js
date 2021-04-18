const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(www.)?(\w*\W*)*/i.test(v);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    validate: {
      validator(v) {
        return /^[\W\s]+$/i.test(v);
      },
    },
    required: true,
  },
  nameEN: {
    type: String,
    validate: {
      validator(v) {
        return /^[\w\s]+$/i.test(v);
      },
    },
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
