import { Configuration } from '../../config/config';
import { MongooseDocument } from 'mongoose';

export class EncryptedMongoDbHelper {

  private constructor() {}

  public static getEncPlugin(): any {
    return Configuration.getBoolean('USE_MONGOOSE_ENCRYPTION')
      || Configuration.getBoolean('USE_TINGODB') ? require('mongoose-encryption') : function () { };
  }

  public static getEncOptions(): any {
    return {
      encryptionKey: Configuration.get('MONGOOSE_ENCRYPT_SECRET'),
      signingKey: Configuration.get('MONGOOSE_ENCRYPT_SIGNKEY'),
    };
  }

  public static async preFunc(model: any & MongooseDocument, next: () => void): Promise<void> {
    if (model.isNew) {
      model.initModel();
    } else {
      model.updateModified(model);
    }
    next();
  }
}
