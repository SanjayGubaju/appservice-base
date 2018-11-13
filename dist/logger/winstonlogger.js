"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const morgan = require("morgan");
const winston = require("winston");
const config_1 = require("../config/config");
const environment_1 = require("../config/environment");
const filetransport_1 = require("./filetransport");
const loglevels_1 = require("./loglevels");
const fshelper = require('mkdir-recursive');
class LoggerWrapper {
    constructor() {
        this.logDir = this.initDir();
        if (config_1.Configuration.getBoolean('ENABLE_WINSTON_LOGGER')) {
            const logger = this.initLogger();
            this.replaceConsoleLog(logger, 'log', 'info');
            this.replaceConsoleLog(logger, 'info');
            this.replaceConsoleLog(logger, 'warn');
            this.replaceConsoleLog(logger, 'error');
            this.replaceConsoleLog(logger, 'debug');
        }
    }
    static getInstance() {
        if (!LoggerWrapper.loggerWrapper) {
            LoggerWrapper.loggerWrapper = new LoggerWrapper();
        }
        return LoggerWrapper.loggerWrapper;
    }
    getServerLogger() {
        const loggerStream = new filetransport_1.WistonFileTransport({
            fileName: `${this.logDir}${path.sep}server.log`,
        });
        return morgan('combined', {
            stream: { write: message => loggerStream.logString(message) },
        });
    }
    initDir() {
        const dir = path.normalize(path.normalize(config_1.Configuration.get('LOG_FOLDER') || LoggerWrapper.DEFAULT_PATH));
        if (dir && dir !== '.') {
            fshelper.mkdirSync(dir);
        }
        return dir || './logs';
    }
    initLogger() {
        const format = this.getFormat();
        return winston.createLogger({
            format,
            level: config_1.Configuration.get('LOG_LEVEL').toLowerCase() || LoggerWrapper.DEFAULT_LOG_LEVEL,
            exitOnError: false,
            transports: this.getTransports(format),
        });
    }
    getFormat() {
        return winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`));
    }
    getTransports(format) {
        const transports = [
            new filetransport_1.WistonFileTransport({
                fileName: `${this.logDir}${path.sep}application.log`,
            }),
            new filetransport_1.WistonFileTransport({
                level: 'error',
                fileName: `${this.logDir}${path.sep}error.log`,
            }),
        ];
        if (config_1.Configuration.getEnvironment() !== environment_1.Environment.Production) {
            transports.push(new winston.transports.Console({
                level: 'info',
                handleExceptions: true,
                format: winston.format.combine(winston.format.colorize(), format),
            }));
        }
        return transports;
    }
    // Replaces console.info, console.log, etc. with function that uses winston logger
    replaceConsoleLog(logger, level, consoleLevel) {
        console[consoleLevel || level] = loglevels_1.LogLevels.isLogLevel(level) ? (...args) => {
            if (args && args.length) {
                if (args.length === 1 && typeof args[0] === 'object') {
                    logger[level]('%o', args[0]);
                }
                else {
                    const [first, ...rest] = args;
                    logger[level](first, ...rest);
                }
            }
        } : (...args) => { };
    }
}
LoggerWrapper.DEFAULT_PATH = './logs';
LoggerWrapper.DEFAULT_LOG_LEVEL = 'info';
class WinstonLogger {
    static init() {
        WinstonLogger.loggerWrapper = LoggerWrapper.getInstance();
        WinstonLogger.isDebugLevel = config_1.Configuration.get('LOG_LEVEL').toLowerCase() === 'debug';
    }
    static getServerLogger() {
        return WinstonLogger.loggerWrapper.getServerLogger();
    }
    static isDebug() {
        return WinstonLogger.isDebugLevel;
    }
}
exports.WinstonLogger = WinstonLogger;
