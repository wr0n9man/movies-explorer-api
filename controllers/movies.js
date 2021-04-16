const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const ValidationError = require('../errors/validation-err');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((movies) => {
      const myMovies = [];
      movies.map((movie) => {
        if (String(movie.owner) === String(req.user._id)) {
          myMovies.push(movie);
        }
        return myMovies;
      });
      res.send(myMovies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((movie) => {
      if (String(movie.owner) === String(req.user._id)) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(() => {
            throw new Error('Not Found');
          })
          .then((movieDelete) => res.send(movieDelete))
          .catch((err) => {
            if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
            if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
            if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
            if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
            next(new InternalServerError('Произошла ошибка'));
          });
      } else {
        const err = new Error('У вас нет прав для данной операции');
        err.statusCode = 409;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;'));
      if (err.name === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      if (err.message === 'Not Found') next(new NotFoundError('Карточка или пользователь не найден.'));
      next(new InternalServerError('Произошла ошибка'));
    });
};
