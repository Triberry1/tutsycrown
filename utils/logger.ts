import winston from 'winston'
import { env } from '../config/env'

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ''
    return `[${timestamp}] ${level}: ${message}${metaStr}`
  })
)

export const logger = winston.createLogger({
  levels: logLevels,
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim())
  },
}