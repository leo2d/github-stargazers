const express = require('express');
const cors = require('cors');
const compression = require('compression');

const routes = require('./web/routes');

const setupApp = () => {
  const app = express();

  app.use(cors());
  app.use(compression());
  app.use(express.json());

  app.use(routes);

  return app;
};

module.exports = setupApp;
