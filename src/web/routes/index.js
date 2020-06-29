const { Router } = require('express');

const repositoriesRoutes = require('./repositories');
const healthCheckRoutes = require('./healthCheck');

const routes = Router();

routes.use(repositoriesRoutes);
routes.use(healthCheckRoutes);

module.exports = routes;
