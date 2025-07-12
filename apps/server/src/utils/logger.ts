import pino from 'pino';
import type { Request } from 'express';
import { env } from './env';

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
};

const logger = pino(loggerConfig);

export class Logger {
  static info(message: string, meta?: any, req?: Request): void {
    const logMeta = this.enrichMeta(meta, req);
    logger.info(logMeta, message);
  }

  static error(message: string, meta?: any, req?: Request): void {
    const logMeta = this.enrichMeta(meta, req);
    logger.error(logMeta, message);
  }

  static warn(message: string, meta?: any, req?: Request): void {
    const logMeta = this.enrichMeta(meta, req);
    logger.warn(logMeta, message);
  }

  static debug(message: string, meta?: any, req?: Request): void {
    const logMeta = this.enrichMeta(meta, req);
    logger.debug(logMeta, message);
  }

  private static enrichMeta(meta: any = {}, req?: Request): any {
    if (!req) return meta;

    return {
      ...meta,
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      ...(req.user && { userId: req.user.id }),
    };
  }
}
