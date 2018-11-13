import * as path from 'path';

import { Format } from 'logform';
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as Transport from 'winston-transport';

import { Configuration } from '../config/config';
import { Environment } from '../config/environment';
import { NextFunc } from '../server/types';
import { WistonFileTransport } from './filetransport';
import { LogLevels } from './loglevels';

const fshelper = require('mkdir-recursive');

class LoggerWrapper {

  public static readonly DEFAULT_PATH = './logs';
  public static readonly DEFAULT_LOG_LEVEL = 'info';

  private static loggerWrapper: LoggerWrapper;

  private logDir: string;

  private constructor() {
    this.logDir = this.initDir();

    if (Configuration.getBoolean('ENABLE_WINSTON_LOGGER')) {
      const logger = this.initLogger();
      this.replaceConsoleLog(logger, 'log', 'info');
      this.replaceConsoleLog(logger, 'info');
      this.replaceConsoleLog(logger, 'warn');
      this.replaceConsoleLog(logger, 'error');
      this.replaceConsoleLog(logger, 'debug');
    }
  }

  public static getInstance(): LoggerWrapper {
    if (!LoggerWrapper.loggerWrapper) {
      LoggerWrapper.loggerWrapper = new LoggerWrapper();
    }
    return LoggerWrapper.loggerWrapper;
  }

  public getServerLogger(): (req: any, res: any, done: NextFunc) => {} {
    const loggerStream = new WistonFileTransport({
      fileName: `${this.logDir}${path.sep}server.log`,
    });
    return morgan('combined', {
      stream: { write: message => loggerStream.logString(message) },
    });
  }

  private initDir(): string {
    const dir: string = path.normalize(path.normalize(Configuration.get('LOG_FOLDER') || LoggerWrapper.DEFAULT_PATH));
    if (dir && dir !== '.') {
      fshelper.mkdirSync(dir);
    }
    return dir || './logs';
  }

  private initLogger(): winston.Logger {
    const format: Format = this.getFormat();
    return winston.createLogger({
      format,
      level: Configuration.get('LOG_LEVEL').toLowerCase() || LoggerWrapper.DEFAULT_LOG_LEVEL,
      exitOnError: false,
      transports: this.getTransports(format),
    });
  }

  private getFormat(): Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
    );
  }

  private getTransports(format: Format): Transport[] {
    const transports: Transport[] = [
      new WistonFileTransport({
        fileName: `${this.logDir}${path.sep}application.log`,
      }),
      new WistonFileTransport({
        level: 'error',
        fileName: `${this.logDir}${path.sep}error.log`,
      }),
    ];

    if (Configuration.getEnvironment() !== Environment.Production) {
      transports.push(new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize(),
          format,
        ),
      }));
    }
    return transports;
  }

  // Replaces console.info, console.log, etc. with function that uses winston logger
  private replaceConsoleLog(logger: winston.Logger, level: string, consoleLevel?: string): void {
    (<any>console)[consoleLevel || level] = LogLevels.isLogLevel(level) ? (...args: any[]) => {
      if (args && args.length) {
        if (args.length === 1 && typeof args[0] === 'object') {
          (<any>logger)[level]('%o', args[0]);
        } else {
          const [first, ...rest] = args;
          (<any>logger)[level](first, ...rest);
        }
      }
    } : (...args: any[]) => { };
  }

}

export class WinstonLogger {

  private static loggerWrapper: LoggerWrapper;
  private static isDebugLevel: boolean;

  public static init() {
    WinstonLogger.loggerWrapper = LoggerWrapper.getInstance();
    WinstonLogger.isDebugLevel = Configuration.get('LOG_LEVEL').toLowerCase() === 'debug';
  }

  public static getServerLogger(): (req: any, res: any, done: NextFunc) => {} {
    return WinstonLogger.loggerWrapper.getServerLogger();
  }

  public static isDebug(): boolean {
    return WinstonLogger.isDebugLevel;
  }

}
