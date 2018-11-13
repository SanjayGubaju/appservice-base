"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEncryptedDocument_1;
"use strict";
const mongoose_1 = require("mongoose");
const stringify = require("safe-stable-stringify");
const typegoose_1 = require("typegoose");
const stringutil_1 = require("../../util/stringutil");
const encryptedmongodbhelper_1 = require("./encryptedmongodbhelper");
let BaseEncryptedDocument = BaseEncryptedDocument_1 = class BaseEncryptedDocument extends typegoose_1.Typegoose {
    getId() {
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
    hasChanged(propname) {
        const value = Object.getOwnPropertyDescriptors(this)['_doc']['value'][propname];
        return stringutil_1.StringUtil.hashCode(value) === this.ids[propname];
    }
    initModel() {
        this.docId = Object.getOwnPropertyDescriptors(this)['_doc']['value']['_id'];
        const ids = {};
        const result = Object.getOwnPropertyDescriptors(this)['_doc']['value'];
        if (result) {
            for (const key in result) {
                if (key !== '_id') {
                    ids[key] = stringutil_1.StringUtil.hashCode(stringify.default(result[key]));
                }
            }
            this.ids = ids;
        }
    }
    update(name) {
        this.ids[name] = stringutil_1.StringUtil.hashCode(stringify.default(Object.getOwnPropertyDescriptors(this)['_doc']['value'][name]));
    }
    updateModified() {
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
    static async findByRefId(id, clazz) {
        const user = await BaseEncryptedDocument_1.findByProperties({ refid: id }, clazz);
        return user;
    }
    static async findByProperties(properties, clazz) {
        const where = {};
        if (properties) {
            for (const key in properties) {
                if (key && properties[key]) {
                    const valueid = stringutil_1.StringUtil.hashCode(stringify.default(properties[key]));
                    where[`ids.${key}`] = valueid;
                }
            }
        }
        const model = await clazz.findOne(where).exec();
        return model;
    }
};
__decorate([
    typegoose_1.prop({ index: true }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], BaseEncryptedDocument.prototype, "docId", void 0);
__decorate([
    typegoose_1.prop({ index: true }),
    __metadata("design:type", Object)
], BaseEncryptedDocument.prototype, "ids", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", mongoose_1.Types.ObjectId)
], BaseEncryptedDocument.prototype, "getId", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseEncryptedDocument.prototype, "hasChanged", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseEncryptedDocument.prototype, "initModel", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseEncryptedDocument.prototype, "update", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseEncryptedDocument.prototype, "updateModified", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mongoose_1.Model]),
    __metadata("design:returntype", Promise)
], BaseEncryptedDocument, "findByRefId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Model]),
    __metadata("design:returntype", Promise)
], BaseEncryptedDocument, "findByProperties", null);
BaseEncryptedDocument = BaseEncryptedDocument_1 = __decorate([
    typegoose_1.plugin(encryptedmongodbhelper_1.EncryptedMongoDbHelper.getEncPlugin(), encryptedmongodbhelper_1.EncryptedMongoDbHelper.getEncOptions())
], BaseEncryptedDocument);
exports.BaseEncryptedDocument = BaseEncryptedDocument;
