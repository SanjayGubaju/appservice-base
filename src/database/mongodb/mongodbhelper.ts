import { Model } from 'mongoose';
import { debug } from 'console';

export class MongoDbHelper {

  private constructor() { }

  public static async findByRefId<T>(id: string, modelClazz: Model<any>): Promise<T> {
    try {
      const item: T = await modelClazz.findOne({ refid: id }).exec();
      return item;
    } catch (e) {
      throw (e);
    }
  }

  public static async createIfNotExists<T>(conditions: any, modelClazz: Model<any>): Promise<T> {
    let item: T = await modelClazz.findOne(conditions).exec();
    debug('Create if not exists, conditions are %o, result is %s', conditions, item);
    if (!item) {
      debug('Create Model %o', modelClazz);
      const result: InstanceType<any> = await modelClazz.create(conditions);
      item = await result.save();
    }
    return item;
  }

}
