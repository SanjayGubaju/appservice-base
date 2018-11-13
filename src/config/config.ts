import { debug, error, info } from 'console';
import * as fs from 'fs';

import * as dotenv from 'dotenv';

import { Environment } from './environment';

export class Configuration {

  private static isInit: boolean;
  private static environment: Environment;

  public static getEnvironment(): Environment {
    return Configuration.environment;
  }

  public static get(name: string, defaultValue: string = ''): string {
    return Configuration.getRawValue(name) || defaultValue;
  }

  public static getBoolean(name: string, defaultValue: boolean = false): boolean {
    const value: string | undefined = Configuration.getRawValue(name);
    if (value && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      return value === 'true';
    }
    return defaultValue;
  }

  public static getNumber(name: string, defaultValue: number): number {
    const value: string | undefined = Configuration.getRawValue(name);
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    return defaultValue;
  }

  public static getObject(name: string, defaultValue = {}): any {
    const value: string | undefined = Configuration.getRawValue(name);
    if (value && value.startsWith('{') && value.endsWith('}')) {
      try {
        return JSON.parse(value);
      } catch (e) {
        debug(e);
        return defaultValue;
      }
    }
    return defaultValue;
  }

  public static getArray(name: string, defaultArray = []): string[] {
    const value: string | undefined = Configuration.getRawValue(name);
    if (value && value.indexOf(',') > 0) {
      return value.split(',');
    }
    return defaultArray;
  }

  public static init() {
    if (Configuration.isInit) {
      return;
    }
    Configuration.isInit = true;
    Configuration.initEnvironment();
    const existsWithDot = fs.existsSync(`./config/.env.${Configuration.environment}`);
    const existsWithoutDot = fs.existsSync(`./config/env.${Configuration.environment}`);

    if (existsWithDot || existsWithoutDot) {
      info('Using configuration for %s to supply config environment variables', Configuration.environment);

      const configFile: Buffer = fs.readFileSync(existsWithDot ? `./config/.env.${Configuration.environment}`
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
            debug('Read file %s into environment variable %s', env.substring(5), key);
            process.env[key] = fs.readFileSync(env.substring(5), 'utf8');
          } else if (env && (env.toLowerCase() === 'true' || env.toLowerCase() === 'false')) {
            process.env[key] === 'true';
          }
        }
      }
    } else if (Configuration.environment !== Environment.Test) {
      error('No configuration file found, stop the server');
      process.exit(1);
    }
  }

  private static initEnvironment(): void {
    const environment = (Configuration.getRawValue('NODE_ENV')
      || Configuration.getRawValue('ENVIRONMENT')
      || 'development').toLowerCase();

    if (environment === Environment.Development) {
      Configuration.environment = Environment.Development;
    } else if (environment === Environment.Test) {
      Configuration.environment = Environment.Test;
    } else if (environment === Environment.Staging) {
      Configuration.environment = Environment.Staging;
    } else if (environment === Environment.Production) {
      Configuration.environment = Environment.Production;
    } else {
      Configuration.environment = Environment.Other;
    }
    info('Environment is %s', Configuration.environment);
  }

  private static getRawValue(name: string) {
    return process.env[name];
  }
}
Configuration.init();
