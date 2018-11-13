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
var AuthUser_1;
"use strict";
const console_1 = require("console");
const bcrypt_1 = require("bcrypt");
const typegoose_1 = require("typegoose");
const uuid_1 = require("uuid");
const emailconfirmation_1 = require("./emailconfirmation");
const baseencdocument_1 = require("../../database/mongodb/baseencdocument");
// @pre<AuthUser>('save', function (next) { AuthUser.preFunc(this, next); })
// @pre('save', async (model: any & MongooseDocument, next: () => void): Promise<void> => { next(); })
// @plugin(EncryptedMongoDbHelper.getEncPlugin(), EncryptedMongoDbHelper.getEncOptions())
let AuthUser = AuthUser_1 = class AuthUser extends baseencdocument_1.BaseEncryptedDocument {
    /**
     * Returns the email address from the user.
     *
     * @returns
     * @memberof AuthUser
     */
    getEmail() {
        return this.email;
    }
    /**
     * Returns the unique user id. May be used to link user data models with this user.
     *
     * @returns
     * @memberof AuthUser
     */
    getUUID() {
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
    async isPasswordValid(password) {
        try {
            return bcrypt_1.compare(password, this.password);
        }
        catch (e) {
            console_1.debug('Error when comparing password with stored hash %o', e);
            return false;
        }
    }
    async beforeSave(model) {
        if (model.isNew) {
            model.password = await bcrypt_1.hash(model.password, 10);
            model.uuid = uuid_1.v4();
            model.initModel();
        }
        else {
            if (model.hasChanged('password')) {
                model.password = await bcrypt_1.hash(model.password, 10);
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
    static async findByEmail(email) {
        return AuthUser_1.findByProperties({ email }, exports.AuthUserModel);
    }
    /**
     * Find an item with a given UUID ({@link uuid})
     *
     * @static
     * @param {string} id
     * @returns {Promise<any>}
     * @memberof AuthUser
     */
    static async findByUUID(id) {
        const user = await this.findByProperties({ uuid: id }, exports.AuthUserModel);
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
    static async createIfNotExists(usermodel) {
        let user = await AuthUser_1.findByEmail(usermodel.email);
        if (!user) {
            const result = await exports.AuthUserModel.create(usermodel);
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
    static async exists(email) {
        const user = await AuthUser_1.findByEmail(email);
        return user != null;
    }
};
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], AuthUser.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], AuthUser.prototype, "password", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], AuthUser.prototype, "created", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", emailconfirmation_1.EmailConfirmation)
], AuthUser.prototype, "emailconfirmation", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], AuthUser.prototype, "uuid", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthUser.prototype, "getEmail", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthUser.prototype, "getUUID", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthUser.prototype, "isPasswordValid", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthUser.prototype, "beforeSave", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthUser, "findByEmail", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthUser, "findByUUID", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthUser, "createIfNotExists", null);
AuthUser = AuthUser_1 = __decorate([
    typegoose_1.pre('save', async function (next) { await this.beforeSave(this); next(); })
], AuthUser);
exports.AuthUser = AuthUser;
// tslint:disable-next-line:variable-name
exports.AuthUserModel = new AuthUser().getModelForClass(AuthUser);
