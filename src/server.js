const express = require('express');
const cors = require('cors');

const { SERVER_PORT } = require('./config/config');
const routes = require('./web/routes/routes');

const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(routes);

  app.listen(SERVER_PORT, () => {
    console.log(`EXPRESS - Server listening on port ${SERVER_PORT}!`);
  });
};

startServer();
