import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { AppError } from '../utils/errors'
import { env } from '../config/env'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  })

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}