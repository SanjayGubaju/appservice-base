"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
class MongoDbStarter {
    constructor(uri) {
        this.uri = uri;
    }
    start() {
        if (this.uri) {
            mongoose.connect(this.uri);
            this.initShutdownListener();
        }
        else {
            console_1.warn('No configuration for MongoDB available, server can not start...');
        }
    }
    initShutdownListener() {
        process.once('SIGINT', () => this.close());
        process.once('SIGTERM', () => this.close());
        process.once('SIGUSR2', () => this.close());
    }
    async close() {
        try {
            console_1.info('Closing database connection...');
            await mongoose.connection.close();
            await mongoose.disconnect();
        }
        catch (e) {
            console_1.error(e);
        }
    }
}
exports.MongoDbStarter = MongoDbStarter;
