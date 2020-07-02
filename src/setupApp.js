const express = require('express');
const cors = require('cors');
const compression = require('compression');

const routes = require('./web/routes');
const errorHandler = require('./web/middlewares/errorHandler');

const setupApp = () => {
  const app = express();

  app.use(cors());
  app.use(compression());
  app.use(express.json());

  app.use(routes);

  app.use(errorHandler);

  return app;
};

module.exports = setupApp;
