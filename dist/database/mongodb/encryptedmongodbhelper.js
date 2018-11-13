"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config/config");
class EncryptedMongoDbHelper {
    constructor() { }
    static getEncPlugin() {
        return config_1.Configuration.getBoolean('USE_MONGOOSE_ENCRYPTION')
            || config_1.Configuration.getBoolean('USE_TINGODB') ? require('mongoose-encryption') : function () { };
    }
    static getEncOptions() {
        return {
            encryptionKey: config_1.Configuration.get('MONGOOSE_ENCRYPT_SECRET'),
            signingKey: config_1.Configuration.get('MONGOOSE_ENCRYPT_SIGNKEY'),
        };
    }
    static async preFunc(model, next) {
        if (model.isNew) {
            model.initModel();
        }
        else {
            model.updateModified(model);
        }
        next();
    }
}
exports.EncryptedMongoDbHelper = EncryptedMongoDbHelper;
