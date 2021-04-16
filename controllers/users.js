const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const ValidationError = require('../errors/validation-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;');
      if (err.name === 'CastError') return res.status(400).send('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;');
      if (err.name === 'Not Found') return res.status(404).send('Карточка или пользователь не найден.');
      return next('Произошла ошибка');
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'top-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      // next(new AuthError('Ошибка авторизации'));
      res.send(err.message);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      next(new InternalServerError('Произошла ошибка'));
    });
};
