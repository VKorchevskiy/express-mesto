const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { processingError } = require('./middlewares/processingError');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(processingError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
