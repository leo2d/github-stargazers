const dotenv = require('dotenv');

const getPath = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return `${__dirname}/.env.test`;
    default:
      return `${__dirname}/.env.dev`;
  }
};

const path = getPath();

dotenv.config({ path });

// Environment variables
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10);

module.exports = {
  SERVER_PORT,
};
