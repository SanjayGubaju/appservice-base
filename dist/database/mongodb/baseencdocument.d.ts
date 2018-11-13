import { Model, Types } from 'mongoose';
import { Typegoose } from 'typegoose';
export declare class BaseEncryptedDocument extends Typegoose {
    private docId;
    private ids;
    getId(): Types.ObjectId;
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
    protected hasChanged(propname: string): boolean;
    protected initModel(): void;
    protected update(name: string): void;
    protected updateModified(): void;
    /**
     * Find an item that contains a refuuid which refrences to another document or model with that
     * unique document id.
     *
     * @static
     * @param {string} id
     * @returns {Promise<any>}
     * @memberof BaseEncryptedDocument
     */
    static findByRefId(id: string, clazz: Model<any>): Promise<any>;
    static findByProperties(properties: any, clazz: Model<any>): Promise<any>;
}
