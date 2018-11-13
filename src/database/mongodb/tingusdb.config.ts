import { info, warn } from 'console';

import { Configuration } from '../../config/config';
import { Environment } from '../../config/environment';

if (Configuration.getBoolean('USE_TINGODB')) {
  if (Configuration.getEnvironment() === Environment.Production) {
    warn('\n******************  WARN  ******************\nYou should not use TingoDB in production!\n');
  }
  (global as any)['TUNGUS_DB_OPTIONS'] = { nativeObjectID: true, searchInArray: true, apiLevel: 200 };
  info('Add tungus db driver');
  require('tungus');
}
