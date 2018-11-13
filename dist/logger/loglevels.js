"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
class LogLevels {
    static isLogLevel(logLevel, allowedLogLevel) {
        if (!LogLevels.allowedLogLevel) {
            LogLevels.allowedLogLevel = LogLevels.logLevels.get((config_1.Configuration.get('LOG_LEVEL') || '').toUpperCase())
                || LogLevels.DEFAULT_LOG_LEVEL;
        }
        const used = LogLevels.logLevels.get(logLevel.toUpperCase()) || LogLevels.DEFAULT_LOG_LEVEL;
        let allowed = LogLevels.allowedLogLevel;
        if (allowedLogLevel) {
            allowed = LogLevels.logLevels.get(allowedLogLevel.toUpperCase()) || LogLevels.DEFAULT_LOG_LEVEL;
        }
        return used >= allowed;
    }
}
LogLevels.DEFAULT_LOG_LEVEL = 3; // INFO
LogLevels.logLevels = new Map([
    ['TRACE', 1],
    ['DEBUG', 2],
    ['INFO', 3],
    ['WARN', 4],
    ['ERROR', 5],
    ['FATAL', 6],
    ['OFF', 7],
]);
exports.LogLevels = LogLevels;
