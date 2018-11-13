import { error, warn, info } from 'console';

import mongoose = require('mongoose');
mongoose.Promise = global.Promise;

export class MongoDbStarter {

  constructor(private uri: string) { }

  public start(): void {
    if (this.uri) {
      mongoose.connect(this.uri);
      this.initShutdownListener();
    } else {
      warn('No configuration for MongoDB available, server can not start...');
    }
  }

  private initShutdownListener(): void {
    process.once('SIGINT', () => this.close());
    process.once('SIGTERM', () => this.close());
    process.once('SIGUSR2', () => this.close());
  }

  private async close(): Promise<void> {
    try {
      info('Closing database connection...');
      await mongoose.connection.close();
      await mongoose.disconnect();
    } catch (e) {
      error(e);
    }
  }

}
