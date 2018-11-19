"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const filter_1 = require("express-validator/filter");
const iban = require("iban");
const validators_1 = require("../../../validation/validators");
const parameterresolver_1 = require("../parameterresolver");
class ExpressValidationResolver {
    constructor() { }
    static getValidationRules(controllerClass, methodName, validationchain) {
        const validators = validationchain ? validationchain : [];
        const descriptors = parameterresolver_1.ParameterResolver.getParams(controllerClass, methodName);
        for (const descriptor of descriptors) {
            if (descriptor.name) {
                validators.push(filter_1.sanitize(descriptor.name).trim());
                if (!validationchain && descriptor.validation) {
                    let validationFunc = check_1.check(descriptor.name);
                    // add correct type to check e.g. check().isEmail()
                    validationFunc = this.expandValidationFunc(descriptor.validation, descriptor.name, validationFunc);
                    validators.push(validationFunc);
                }
            }
        }
        return validators;
    }
    static expandValidationFunc(paramValidation, name, validationFunc, message) {
        let valFunc = paramValidation.required ? validationFunc : validationFunc.optional();
        let type;
        let msg;
        if (paramValidation.custom) {
            msg = message ? message : `Parameter ${name} is not valid`;
            valFunc = valFunc.custom(paramValidation.custom);
            return valFunc.withMessage(msg);
        }
        switch (paramValidation.type) {
            case validators_1.Validators.Alpha:
                type = 'letters only';
                valFunc = valFunc.isAlpha();
                break;
            case validators_1.Validators.Alphanumeric:
                type = 'letters and numbers only';
                valFunc = valFunc.isAlphanumeric();
                break;
            case validators_1.Validators.Ascii:
                type = 'ascii chars only';
                valFunc = valFunc.isAscii();
                break;
            case validators_1.Validators.Base64:
                type = 'Base64';
                valFunc = valFunc.isBase64();
                break;
            case validators_1.Validators.Before:
                msg = message ? message : `Parameter "${name}" is not before now`;
                return valFunc.isBefore().withMessage(msg);
            case validators_1.Validators.Boolean:
                type = 'boolean';
                valFunc = valFunc.isBoolean();
                break;
            case validators_1.Validators.Decimal:
                type = 'decimal';
                valFunc = valFunc.isDecimal();
                break;
            case validators_1.Validators.Email:
                msg = message ? message : `Parameter "${name}" is not a valid email address`;
                return valFunc.isEmail().normalizeEmail().withMessage(msg);
            case validators_1.Validators.Float:
                type = 'float';
                valFunc = valFunc.isFloat();
                break;
            case validators_1.Validators.IBAN:
                type = 'IBAN';
                valFunc = valFunc.custom(iban.isValid);
                break;
            case validators_1.Validators.ISO8601:
                type = 'ISO8601';
                valFunc = valFunc.isISO8601();
                break;
            case validators_1.Validators.JSON:
                type = 'JSON';
                valFunc = valFunc.isJSON();
                break;
            case validators_1.Validators.Numeric:
                msg = message ? message : `Parameter "${name}" is not numeric`;
                return valFunc.isNumeric().withMessage(msg);
            case validators_1.Validators.UUID:
                msg = message ? message : `Parameter "${name}" is not an UUID`;
                return valFunc.isUUID().withMessage(msg);
            default:
                msg = message ? message : `Parameter "${name}" is mandatory`;
                return valFunc.not().isEmpty().withMessage(msg);
        }
        msg = message ? message : `Parameter "${name}" is not from type ${type}`;
        return valFunc.withMessage(msg);
    }
}
exports.ExpressValidationResolver = ExpressValidationResolver;
