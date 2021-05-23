const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;
const routes = require('./routes');
const router = require('express').Router();

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
//
// const logger = (req, res, next) => {
//   console.log('Запрос залогирован!');
//   next();
// };
//
// app.use(logger);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
