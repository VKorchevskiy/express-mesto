const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;
const userRoutes = require('./routes/users');

const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());

app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
