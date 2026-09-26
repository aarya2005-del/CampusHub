const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CampusHub API',
      version: '1.0.0',
      description: 'CampusHub Backend API',
    },
   servers: [
  {
    url: process.env.SERVER_URL || 'http://localhost:5000',
    description:
      process.env.NODE_ENV === 'production'
        ? 'Production server'
        : 'Development server',
  },
],
  },

  // IMPORTANT: use absolute pattern from project root
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};