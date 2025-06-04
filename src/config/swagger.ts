import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assembly Parts Inventory API',
      version: '1.0.0',
      description: 'Manage raw and assembled parts with inventory tracking',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], 
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
