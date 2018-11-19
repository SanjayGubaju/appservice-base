"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require("safe-stable-stringify");
const validationschema_1 = require("../../../validation/validationschema");
const validators_1 = require("../../../validation/validators");
const parameter_decorator_1 = require("../parameter.decorator");
const parameterresolver_1 = require("../parameterresolver");
class AjvValidationResolver {
    constructor() { }
    static getValidationFunction(controllerClass, methodName, validationchain) {
        // const validators: ValidationFunc[] = validationchain ? validationchain : [];
        const validators = AjvValidationResolver.applyValidators(controllerClass, methodName);
        return (request, response, done) => {
            let errors = [];
            let contentParams;
            let contentQueryBody;
            let content;
            let length = validators.length;
            // tslint:disable-next-line:no-increment-decrement
            while (length--) {
                const validator = validators[length];
                // check params
                if (validator.requestcontenttype.length === 1) {
                    content = contentParams = contentParams ? contentParams
                        : AjvValidationResolver.getContents(validator.requestcontenttype, request);
                }
                else { // check query and body
                    content = contentQueryBody = contentQueryBody ? contentQueryBody
                        : AjvValidationResolver.getContents(validator.requestcontenttype, request);
                }
                if (!validator.validate(content)) {
                    errors = errors.concat(validator.validate.errors);
                }
            }
            if (errors.length) {
                const errorMsg = { errors: Object.assign.apply(null, errors) };
                // Fastify
                if (request['raw']) {
                    response.serializer((payload) => stringify.default(payload));
                    response.type('application/json; charset=utf-8').status(400);
                    done(errorMsg);
                }
                else { // express
                    response.type('application/json; charset=utf-8').status(400).send(errorMsg);
                }
            }
            else {
                done();
            }
        };
    }
    static applyValidators(controllerClass, methodName) {
        const validationFunctions = [];
        const parameters = parameterresolver_1.ParameterResolver.getParams(controllerClass, methodName);
        // TODO: consider validationchain
        for (const parameter of parameters) {
            if (parameter.name && parameter.validation) {
                const valSchema = validationschema_1.ValidationSchema.check(parameter.name);
                if (parameter.paramtype === parameter_decorator_1.ParamType.PATHPARAM) {
                    valSchema.useRequestContent(validationschema_1.RequestContentType.PARAMS);
                }
                else {
                    valSchema.useRequestContent(validationschema_1.RequestContentType.QUERY, validationschema_1.RequestContentType.BODY);
                }
                // add correct type to check e.g. check().isEmail()
                this.addValidationFunc(parameter.validation, parameter.name, valSchema);
                validationFunctions.push(valSchema.getValidationFunc());
            }
        }
        return validationFunctions;
    }
    static getContents(contentTypes, request) {
        if (contentTypes.length === 1) {
            return request[contentTypes[0]];
        }
        let merged = {};
        for (const contentType of contentTypes) {
            merged = Object.assign({}, merged, request[contentType]);
        }
        return merged;
    }
    static addValidationFunc(paramValidation, name, validationFunc, message) {
        let valFunc = paramValidation.required ? validationFunc.required() : validationFunc;
        let type;
        let msg;
        if (paramValidation.custom) {
            msg = message ? message : `Parameter ${name} is not valid`;
            valFunc = valFunc.isCustom(paramValidation.custom);
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
            case validators_1.Validators.Float:
                type = 'decimal';
                valFunc = valFunc.isDecimal();
                break;
            case validators_1.Validators.Email:
                msg = message ? message : `Parameter "${name}" is not a valid email address`;
                return valFunc.isEmail().withMessage(msg);
            case validators_1.Validators.ISO8601:
                type = 'ISO8601';
                valFunc = valFunc.isISO8601();
                break;
            case validators_1.Validators.IBAN:
                type = 'IBAN';
                valFunc = valFunc.isIBAN();
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
                msg = message ? message : `Parameter "${name}" must not be empty`;
                return valFunc.isNotEmpty().withMessage(msg);
        }
        msg = msg ? msg : `Parameter "${name}" is not from type ${type}`;
        return valFunc.withMessage(msg);
    }
}
exports.AjvValidationResolver = AjvValidationResolver;
