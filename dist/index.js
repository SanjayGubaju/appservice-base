"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./database/mongodb/tingusdb.config");
const config_1 = require("./config/config");
const winstonlogger_1 = require("./logger/winstonlogger");
if (config_1.Configuration.getBoolean('ENABLE_WINSTON_LOGGER')) {
    winstonlogger_1.WinstonLogger.init();
}
__export(require("./auth/exports"));
__export(require("./config/exports"));
__export(require("./database/mongodb/exports"));
__export(require("./decorators/exports"));
__export(require("./email/exports"));
__export(require("./logger/exports"));
__export(require("./server/exports"));
__export(require("./util/exports"));
__export(require("./validation/exports"));
var serverapplication_1 = require("./serverapplication");
exports.ServerApplication = serverapplication_1.ServerApplication;
// export * from 'typegoose';
if (+process.version.substring(1, 3) < 10) {
    Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}
