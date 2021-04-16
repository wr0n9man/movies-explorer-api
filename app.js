const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { isCelebrateError } = require('celebrate');
const index = require('./routes/index');

const { PORT = 3001 } = process.env;
const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200, // эта опция позволяет устанавливать куки
};

app.use(cors(options));

mongoose.connect('mongodb://localhost:27017/diplomdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/api/', index);

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (!isCelebrateError(err)) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ message: err.message });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  next();
});

app.listen(PORT);
