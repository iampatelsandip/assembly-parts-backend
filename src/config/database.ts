import mongoose from 'mongoose';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/assembly-parts';
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString, {
        retryWrites: true,
        w: 'majority'
      });
      
      console.log('Connected to MongoDB successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}