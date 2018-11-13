import './database/mongodb/tingusdb.config';

import { Configuration } from './config/config';
import { WinstonLogger } from './logger/winstonlogger';

if (Configuration.getBoolean('ENABLE_WINSTON_LOGGER')) {
  WinstonLogger.init();
}

export * from './auth/exports';
export * from './config/exports';
export * from './database/mongodb/exports';
export * from './decorators/exports';
export * from './email/exports';
export * from './logger/exports';
export * from './server/exports';
export * from './util/exports';
export * from './validation/exports';
export { ServerApplication } from './serverapplication';
export { AuthenticationConfig } from './authentication.config';

// export * from 'typegoose';

if (+process.version.substring(1, 3) < 10) {
  (<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}
