import { Configuration } from '../config/config';

export class LogLevels {

  public static readonly DEFAULT_LOG_LEVEL = 3; // INFO

  private static logLevels: Map<string, number> = new Map<string, number>([
    ['TRACE', 1],
    ['DEBUG', 2],
    ['INFO', 3],
    ['WARN', 4],
    ['ERROR', 5],
    ['FATAL', 6],
    ['OFF', 7],
  ]);

  private static allowedLogLevel: number;

  public static isLogLevel(logLevel: string, allowedLogLevel?: string) {
    if (!LogLevels.allowedLogLevel) {
      LogLevels.allowedLogLevel = LogLevels.logLevels.get((Configuration.get('LOG_LEVEL') || '').toUpperCase())
        || LogLevels.DEFAULT_LOG_LEVEL;
    }
    const used: number = LogLevels.logLevels.get(logLevel.toUpperCase()) || LogLevels.DEFAULT_LOG_LEVEL;
    let allowed: number = LogLevels.allowedLogLevel;
    if (allowedLogLevel) {
      allowed = LogLevels.logLevels.get(allowedLogLevel.toUpperCase()) || LogLevels.DEFAULT_LOG_LEVEL;
    }
    return used >= allowed;
  }
}
