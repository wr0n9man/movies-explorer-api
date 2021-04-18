const { isCelebrateError } = require('celebrate');

module.exports = ((err, req, res, next) => {
  if (!isCelebrateError(err)) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ message: err.message });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  next();
});


