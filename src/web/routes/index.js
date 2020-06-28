const { Router } = require('express');

const healthCheckRoutes = require('./healthCheck');

const routes = Router();

routes.use(healthCheckRoutes);

module.exports = routes;
