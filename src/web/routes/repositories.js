const { Router } = require('express');
const repositoriesController = require('../controllers/repositoriesController');

const repositoriesRoutes = Router();

const prefix = '/repositories';

repositoriesRoutes.get(
  `${prefix}/:name`,
  repositoriesController.getRepositoriesStarsByOrg
);

module.exports = repositoriesRoutes;
