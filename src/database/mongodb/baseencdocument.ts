import { Model, Types } from 'mongoose';
import * as stringify from 'safe-stable-stringify';
import { Typegoose, instanceMethod, prop, staticMethod, plugin } from 'typegoose';

import { StringUtil } from '../../util/stringutil';
import { EncryptedMongoDbHelper } from './encryptedmongodbhelper';

@plugin(EncryptedMongoDbHelper.getEncPlugin(), EncryptedMongoDbHelper.getEncOptions())
export class BaseEncryptedDocument extends Typegoose {

  @prop({ index: true })
  private docId!: Types.ObjectId;

  @prop({ index: true })
  private ids!: any;

  @instanceMethod
  public getId(): Types.ObjectId {
    return this.docId;
  }

  /**
   * When using the encryption plugin the properties are always updated with the decrypted values.
   * Therefore the method isModified from mongoose does not return the correct result. This method
   * compares a value with a internally hold hash key to check, if the value has been changed. If
   * you use the mongoose-encrypt plugin you should use this method to check, if values have been
   * changed.
   *
   * @protected
   * @param {string} propname
   * @returns
   * @memberof BaseEncryptedDocument
   */
  @instanceMethod
  protected hasChanged(propname: string) {
    const value = Object.getOwnPropertyDescriptors(this)['_doc']['value'][propname];
    return StringUtil.hashCode(value) === this.ids[propname];
  }

  @instanceMethod
  // create uuid and internally hold hash keys that allows to check for modified values.
  protected initModel(): void {
    this.docId = Object.getOwnPropertyDescriptors(this)['_doc']['value']['_id'];
    const ids: any = {};
    const result = Object.getOwnPropertyDescriptors(this)['_doc']['value'];
    if (result) {
      for (const key in result) {
        if (key !== '_id') {
          ids[key] = StringUtil.hashCode(stringify.default(result[key]));
        }
      }
      this.ids = ids;
    }
  }

  @instanceMethod
  protected update(name: string): void {
    this.ids[name] = StringUtil.hashCode(
      stringify.default(Object.getOwnPropertyDescriptors(this)['_doc']['value'][name]));
  }

  @instanceMethod
  protected updateModified(): void {
    for (const key in this.ids) {
      if (this.hasChanged(key)) {
        this.update(key);
      }
    }
  }

  /**
   * Find an item that contains a refuuid which refrences to another document or model with that
   * unique document id.
   *
   * @static
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof BaseEncryptedDocument
   */
  @staticMethod
  public static async findByRefId(id: string, clazz: Model<any>): Promise<any> {
    const user: any = await BaseEncryptedDocument.findByProperties({ refid: id }, clazz);
    return user;
  }

  @staticMethod
  public static async findByProperties(properties: any, clazz: Model<any>): Promise<any> {
    const where: any = {};
    if (properties) {
      for (const key in properties) {
        if (key && properties[key]) {
          const valueid: number = StringUtil.hashCode(stringify.default(properties[key]));
          where[`ids.${key}`] = valueid;
        }
      }
    }
    const model: any = await clazz.findOne(where).exec();
    return model;
  }

}
