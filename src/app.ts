import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'reflect-metadata';

import { partRoutes } from './routes/part.routes';
import { errorHandler } from './middleware/error.middleware';
import { DatabaseConfig } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { setupSwagger } from './config/swagger';

export class App {
  public app: Application;
  private databaseConfig: DatabaseConfig;

  constructor() {
    this.app = express();
    this.databaseConfig = DatabaseConfig.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP'
    });
    this.app.use('/api', limiter);
    setupSwagger(this.app);
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
  }

  private initializeRoutes(): void {
    this.app.use('/api', partRoutes);
    
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(port: number = 3000): Promise<void> {
    try {
      await this.databaseConfig.connect();
      
      this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Health check available at http://localhost:${port}/health`);
          console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}