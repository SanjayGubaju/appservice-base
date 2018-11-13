import { Model } from 'mongoose';
export declare class MongoDbHelper {
    private constructor();
    static findByRefId<T>(id: string, modelClazz: Model<any>): Promise<T>;
    static createIfNotExists<T>(conditions: any, modelClazz: Model<any>): Promise<T>;
}
