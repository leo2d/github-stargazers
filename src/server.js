const config = require('./config');
const setupApp = require('./setupApp');

const startServer = () => {
  const app = setupApp();

  app.listen(config.server.port, () => {
    console.log(`EXPRESS- Server listening on port ${config.server.port}!`);
  });
};

startServer();
