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

const server = require('./components/server');
const github = require('./components/github');

const config = {
  server,
  github,
};

module.exports = config;
