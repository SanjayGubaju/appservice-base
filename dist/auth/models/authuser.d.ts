/// <reference types="mongoose" />
import { InstanceType } from 'typegoose';
import { BaseEncryptedDocument } from '../../database/mongodb/baseencdocument';
export declare class AuthUser extends BaseEncryptedDocument {
    private email;
    private password;
    private created;
    private emailconfirmation;
    /**
     * Unique user id that may be used from other models as reference to a certain user when storing
     * user data
     *
     * @private
     * @type {string}
     * @memberof AuthUser
     */
    private uuid;
    /**
     * Returns the email address from the user.
     *
     * @returns
     * @memberof AuthUser
     */
    getEmail(): string;
    /**
     * Returns the unique user id. May be used to link user data models with this user.
     *
     * @returns
     * @memberof AuthUser
     */
    getUUID(): string;
    /**
     * Password is stored as hash and can not be compared directly. This method checks if a given
     * password matches the stored hash.
     *
     * @param {string} password
     * @returns {Promise<boolean>}
     * @memberof AuthUser
     */
    isPasswordValid(password: string): Promise<boolean>;
    private beforeSave;
    /**
     * Find a user for a given email.
     *
     * @static
     * @param {string} email
     * @returns {Promise<AuthUser>}
     * @memberof AuthUser
     */
    static findByEmail(email: string): Promise<AuthUser>;
    /**
     * Find an item with a given UUID ({@link uuid})
     *
     * @static
     * @param {string} id
     * @returns {Promise<any>}
     * @memberof AuthUser
     */
    static findByUUID(id: string): Promise<any>;
    /**
     * Creates a new user only if it not already exists.
     *
     * @static
     * @param {*} usermodel
     * @returns {Promise<void>}
     * @memberof AuthUser
     */
    static createIfNotExists(usermodel: any): Promise<AuthUser>;
    /**
     * Checks, if a user with the given email address already exists.
     *
     * @static
     * @param {string} email
     * @returns {Promise<boolean>}
     * @memberof AuthUser
     */
    static exists(email: string): Promise<boolean>;
}
export declare const AuthUserModel: import("mongoose").Model<InstanceType<AuthUser>, {}> & AuthUser & typeof AuthUser;
