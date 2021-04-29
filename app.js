/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

// МИДЛВЕРЫ
app.use(express.json());
// временное решение для авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '60792fba61c606678a3ac3ed',
  };

  next();
});

// ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(helmet());
app.disable('x-powered-by');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
