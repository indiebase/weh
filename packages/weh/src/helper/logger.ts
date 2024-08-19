import pino from 'pino';

export const logger = pino({
  level: 'debug',
  // level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
    },
  },
});
