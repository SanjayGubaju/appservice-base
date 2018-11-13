import { MongooseDocument } from 'mongoose';
export declare class EncryptedMongoDbHelper {
    private constructor();
    static getEncPlugin(): any;
    static getEncOptions(): any;
    static preFunc(model: any & MongooseDocument, next: () => void): Promise<void>;
}
