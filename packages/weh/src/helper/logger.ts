import 'winston-daily-rotate-file';

import { resolve } from 'node:path';

import winston, { transport } from 'winston';

import { WEH_LOG_PATH } from '../constants';

const persistentLog = process.env.PERSISTENT_LOG === 'true';

const transports: transport[] = [];

if (persistentLog) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: resolve(WEH_LOG_PATH, 'error-%DATE%.log'),
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
    new winston.transports.DailyRotateFile({
      filename: resolve(WEH_LOG_PATH, 'combined-%DATE%.log'),
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  );
}

export const logger = winston.createLogger({
  level: kDevMode ? 'debug' : 'error',
  format: winston.format.json(),
  transports,
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: resolve(WEH_LOG_PATH, 'exceptions-%DATE%.log'),
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});
