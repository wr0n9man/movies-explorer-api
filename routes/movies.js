const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { deleteMovie, createMovie, getMovie } = require('../controllers/movies');

router.get('/movies', getMovie);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().integer().required().max(1000),
    year: Joi.string().integer().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).required().min(6),
    trailer: Joi.string().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/).required().min(6),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    thumbnail: Joi.string().pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).required().min(6),
    movieId: Joi.number().required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
