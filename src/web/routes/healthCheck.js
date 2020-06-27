const { Router } = require('express');

const healthCheckRoutes = Router();

const prefix = '/health';

healthCheckRoutes.get(`${prefix}/`, (req, res) => {
  res.json([{ source: 'server', status: 'health', date: new Date() }]);
});

module.exports = healthCheckRoutes;
