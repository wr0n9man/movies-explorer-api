const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const errorHandler = require ('./middlewares/errorHandler')

const { NODE_ENV, MONGO_PORT } = process.env;
const { PORT = 3001 } = process.env;
const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    'http://localhost:3000',
    'http://wr0n9man.movie.nomoredomains.icu'
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200, // эта опция позволяет устанавливать куки
};

app.use(cors(options));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGO_PORT : 'mongodb://localhost:27017/diplomdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', index);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
