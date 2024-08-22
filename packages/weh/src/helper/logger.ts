import 'winston-daily-rotate-file';

import { resolve } from 'node:path';

import { TransformableInfo } from 'logform';
import winston, { transport } from 'winston';

import { WEH_LOG_PATH } from '../constants';

const persistentLog = process.env.PERSISTENT_LOG === 'true';

function printFormat({ timestamp, level, message, stack }: TransformableInfo) {
  message = typeof message === 'object' ? JSON.stringify(message) : message;
  return `${timestamp} [${level}] : ${message} ${stack ?? ''}`;
}

const transports: transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.splat(),
      winston.format.printf(printFormat),
    ),
  }),
];

if (persistentLog) {
  transports.push(
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
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
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
