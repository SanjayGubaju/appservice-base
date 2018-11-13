export declare class LogLevels {
    static readonly DEFAULT_LOG_LEVEL = 3;
    private static logLevels;
    private static allowedLogLevel;
    static isLogLevel(logLevel: string, allowedLogLevel?: string): boolean;
}
