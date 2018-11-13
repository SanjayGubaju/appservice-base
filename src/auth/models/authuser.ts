import { debug } from 'console';

import { compare, hash } from 'bcrypt';
import { MongooseDocument } from 'mongoose';
import { InstanceType, instanceMethod, prop, staticMethod, pre } from 'typegoose';
import { v4 as uuid } from 'uuid';

import { EmailConfirmation } from './emailconfirmation';
import { BaseEncryptedDocument } from '../../database/mongodb/baseencdocument';

// @pre<AuthUser>('save', function (next) { AuthUser.preFunc(this, next); })
// @pre('save', async (model: any & MongooseDocument, next: () => void): Promise<void> => { next(); })
// @plugin(EncryptedMongoDbHelper.getEncPlugin(), EncryptedMongoDbHelper.getEncOptions())
@pre<any & MongooseDocument>('save', async function (next: () => void) { await this.beforeSave(this); next(); })
export class AuthUser extends BaseEncryptedDocument {

  @prop({ required: true })
  private email!: string;

  @prop({ required: true })
  private password!: string;

  @prop({ default: Date.now })
  private created!: Date;

  @prop()
  private emailconfirmation!: EmailConfirmation;

  /**
   * Unique user id that may be used from other models as reference to a certain user when storing
   * user data
   *
   * @private
   * @type {string}
   * @memberof AuthUser
   */
  @prop()
  private uuid!: string;

  /**
   * Returns the email address from the user.
   *
   * @returns
   * @memberof AuthUser
   */
  @instanceMethod
  public getEmail() {
    return this.email;
  }

  /**
   * Returns the unique user id. May be used to link user data models with this user.
   *
   * @returns
   * @memberof AuthUser
   */
  @instanceMethod
  public getUUID() {
    return this.uuid;
  }

  /**
   * Password is stored as hash and can not be compared directly. This method checks if a given
   * password matches the stored hash.
   *
   * @param {string} password
   * @returns {Promise<boolean>}
   * @memberof AuthUser
   */
  @instanceMethod
  public async isPasswordValid(password: string): Promise<boolean> {
    try {
      return compare(password, this.password);
    } catch (e) {
      debug('Error when comparing password with stored hash %o', e);
      return false;
    }
  }

  @instanceMethod
  private async beforeSave(model: any & MongooseDocument): Promise<void> {
    if (model.isNew) {
      model.password = await hash(model.password, 10);
      model.uuid = uuid();
      model.initModel();
    } else {
      if (model.hasChanged('password')) {
        model.password = await hash(model.password, 10);
      }
      model.updateModified(model);
    }
  }

  /**
   * Find a user for a given email.
   *
   * @static
   * @param {string} email
   * @returns {Promise<AuthUser>}
   * @memberof AuthUser
   */
  @staticMethod
  public static async findByEmail(email: string): Promise<AuthUser> {
    return AuthUser.findByProperties({ email }, AuthUserModel);
  }

  /**
   * Find an item with a given UUID ({@link uuid})
   *
   * @static
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof AuthUser
   */
  @staticMethod
  public static async findByUUID(id: string): Promise<any> {
    const user: any = await this.findByProperties({ uuid: id }, AuthUserModel);
    return user;
  }

  /**
   * Creates a new user only if it not already exists.
   *
   * @static
   * @param {*} usermodel
   * @returns {Promise<void>}
   * @memberof AuthUser
   */
  @staticMethod
  public static async createIfNotExists(usermodel: any): Promise<AuthUser> {
    let user: AuthUser = await AuthUser.findByEmail(usermodel.email);
    if (!user) {
      const result: InstanceType<AuthUser> = await AuthUserModel.create(usermodel);
      user = await result.save();
    }
    return user;
  }

  /**
   * Checks, if a user with the given email address already exists.
   *
   * @static
   * @param {string} email
   * @returns {Promise<boolean>}
   * @memberof AuthUser
   */
  public static async exists(email: string) : Promise<boolean> {
    const user: AuthUser = await AuthUser.findByEmail(email);
    return user != null;
  }

}

// tslint:disable-next-line:variable-name
export const AuthUserModel = new AuthUser().getModelForClass(AuthUser);
