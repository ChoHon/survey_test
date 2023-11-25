import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { utilities } from 'nest-winston';

const { combine, timestamp, colorize } = winston.format;
const logDir = __dirname + '/../../logs';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};
winston.addColors(colors);

export const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

const consoleOpts = {
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
  handleExceptions: true,
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    utilities.format.nestLike('Servey', {
      prettyPrint: true,
    }),
  ),
};

const transports = [
  new winston.transports.Console(consoleOpts),
  new winstonDaily(dailyOptions('info')),
  new winstonDaily(dailyOptions('error')),
];

export const winstonLogger = {
  transports,
};
