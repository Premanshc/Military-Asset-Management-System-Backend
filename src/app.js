const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

app.use(cors({
  origin: ['https://military-asset-management-system-fr.vercel.app'],
  credentials: true,
}));
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
