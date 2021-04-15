/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

// МИДЛВЕРЫ
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// временное решение для авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '6077e735e5da5329bc86ca57',
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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
