const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const user = require('./users');
const movie = require('./movies');

router.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

router.post('/api/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

router.use('/api/', auth, movie);
router.use('/api/', auth, user);

router.get('*',function(req, res, next){
  next(new NotFoundError('Страницы не существует'));
}
);

module.exports = router;
