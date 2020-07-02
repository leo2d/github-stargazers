const { Router } = require('express');
const healthCheckController = require('../controllers/healthCheckController');

const healthCheckRoutes = Router();

const prefix = '/health';

healthCheckRoutes.get(`${prefix}/`, healthCheckController.check);

module.exports = healthCheckRoutes;
