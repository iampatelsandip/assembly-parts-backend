import { Request, Response, NextFunction } from 'express';
import { AppError, InsufficientInventoryError } from '../errors/app.error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof InsufficientInventoryError) {
    res.status(400).json({
      status: 'FAILED',
      message: error.message
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  // Handle MongoDB duplicate key error
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }

  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};