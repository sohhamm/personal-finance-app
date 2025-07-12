import pino from 'pino'
import {env} from './env'

const loggerConfig = {
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
}

const logger = pino(loggerConfig)

export class Logger {
  static info(message: string, meta?: any): void {
    logger.info(meta, message)
  }

  static error(message: string, meta?: any): void {
    logger.error(meta, message)
  }

  static warn(message: string, meta?: any): void {
    logger.warn(meta, message)
  }

  static debug(message: string, meta?: any): void {
    logger.debug(meta, message)
  }
}
