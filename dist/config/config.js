"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const fs = require("fs");
const dotenv = require("dotenv");
const environment_1 = require("./environment");
class Configuration {
    static getEnvironment() {
        return Configuration.environment;
    }
    static get(name, defaultValue = '') {
        return Configuration.getRawValue(name) || defaultValue;
    }
    static getBoolean(name, defaultValue = false) {
        const value = Configuration.getRawValue(name);
        if (value && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
            return value === 'true';
        }
        return defaultValue;
    }
    static getNumber(name, defaultValue) {
        const value = Configuration.getRawValue(name);
        if (!isNaN(Number(value))) {
            return Number(value);
        }
        return defaultValue;
    }
    static getObject(name, defaultValue = {}) {
        const value = Configuration.getRawValue(name);
        if (value && value.startsWith('{') && value.endsWith('}')) {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                console_1.debug(e);
                return defaultValue;
            }
        }
        return defaultValue;
    }
    static getArray(name, defaultArray = []) {
        const value = Configuration.getRawValue(name);
        if (value && value.indexOf(',') > 0) {
            return value.split(',');
        }
        return defaultArray;
    }
    static init() {
        if (Configuration.isInit) {
            return;
        }
        Configuration.isInit = true;
        Configuration.initEnvironment();
        const existsWithDot = fs.existsSync(`./config/.env.${Configuration.environment}`);
        const existsWithoutDot = fs.existsSync(`./config/env.${Configuration.environment}`);
        if (existsWithDot || existsWithoutDot) {
            console_1.info('Using configuration for %s to supply config environment variables', Configuration.environment);
            const configFile = fs.readFileSync(existsWithDot ? `./config/.env.${Configuration.environment}`
                : `./config/env.${Configuration.environment}`);
            const envConfig = dotenv.parse(configFile);
            dotenv.config({
                path: existsWithDot ? `./config/.env.${Configuration.environment}`
                    : `./config/env.${Configuration.environment}`,
            });
            for (const key in process.env) {
                if (envConfig[key]) {
                    const env = process.env[key];
                    if (env && env.startsWith('file:')) {
                        console_1.debug('Read file %s into environment variable %s', env.substring(5), key);
                        process.env[key] = fs.readFileSync(env.substring(5), 'utf8');
                    }
                    else if (env && (env.toLowerCase() === 'true' || env.toLowerCase() === 'false')) {
                        process.env[key] === 'true';
                    }
                }
            }
        }
        else if (Configuration.environment !== environment_1.Environment.Test) {
            console_1.error('No configuration file found, stop the server');
            process.exit(1);
        }
    }
    static initEnvironment() {
        const environment = (Configuration.getRawValue('NODE_ENV')
            || Configuration.getRawValue('ENVIRONMENT')
            || 'development').toLowerCase();
        if (environment === environment_1.Environment.Development) {
            Configuration.environment = environment_1.Environment.Development;
        }
        else if (environment === environment_1.Environment.Test) {
            Configuration.environment = environment_1.Environment.Test;
        }
        else if (environment === environment_1.Environment.Staging) {
            Configuration.environment = environment_1.Environment.Staging;
        }
        else if (environment === environment_1.Environment.Production) {
            Configuration.environment = environment_1.Environment.Production;
        }
        else {
            Configuration.environment = environment_1.Environment.Other;
        }
        console_1.info('Environment is %s', Configuration.environment);
    }
    static getRawValue(name) {
        return process.env[name];
    }
}
exports.Configuration = Configuration;
Configuration.init();
