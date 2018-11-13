"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
class MongoDbHelper {
    constructor() { }
    static async findByRefId(id, modelClazz) {
        try {
            const item = await modelClazz.findOne({ refid: id }).exec();
            return item;
        }
        catch (e) {
            throw (e);
        }
    }
    static async createIfNotExists(conditions, modelClazz) {
        let item = await modelClazz.findOne(conditions).exec();
        console_1.debug('Create if not exists, conditions are %o, result is %s', conditions, item);
        if (!item) {
            console_1.debug('Create Model %o', modelClazz);
            const result = await modelClazz.create(conditions);
            item = await result.save();
        }
        return item;
    }
}
exports.MongoDbHelper = MongoDbHelper;
