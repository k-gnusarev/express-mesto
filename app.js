const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

// МИДЛВЕРЫ
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
