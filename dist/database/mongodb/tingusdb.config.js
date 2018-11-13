"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const config_1 = require("../../config/config");
const environment_1 = require("../../config/environment");
if (config_1.Configuration.getBoolean('USE_TINGODB')) {
    if (config_1.Configuration.getEnvironment() === environment_1.Environment.Production) {
        console_1.warn('\n******************  WARN  ******************\nYou should not use TingoDB in production!\n');
    }
    global['TUNGUS_DB_OPTIONS'] = { nativeObjectID: true, searchInArray: true, apiLevel: 200 };
    console_1.info('Add tungus db driver');
    require('tungus');
}
