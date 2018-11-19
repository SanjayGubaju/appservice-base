"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajvinstance_1 = require("./ajvinstance");
var RequestContentType;
(function (RequestContentType) {
    RequestContentType["QUERY"] = "query";
    RequestContentType["PARAMS"] = "params";
    RequestContentType["BODY"] = "body";
})(RequestContentType = exports.RequestContentType || (exports.RequestContentType = {}));
class ValidationSchema {
    constructor(name) {
        this.isRequired = false;
        this.ajv = ajvinstance_1.AjvInstance.getInstance();
        this.fieldName = name;
        this.requestContentTypes = [];
    }
    static check(name) {
        return new ValidationSchema(name);
    }
    useRequestContent(...requestContentNames) {
        for (const requestContentName of requestContentNames) {
            this.requestContentTypes.push(requestContentName);
        }
        this.requestContentTypes.concat([...requestContentNames]);
        return this;
    }
    getValidationFunc() {
        const schema = {
            type: 'object',
            properties: {},
        };
        if (this.isRequired) {
            schema.required = [this.fieldName];
            schema.properties[this.fieldName] = {
                type: 'string',
                format: this.format,
            };
        }
        return {
            requestcontenttype: this.requestContentTypes,
            validate: this.ajv.compile(schema),
        };
    }
    required() {
        this.isRequired = true;
        return this;
    }
    isAlpha() {
        this.format = 'alpha';
        return this;
    }
    isAlphanumeric() {
        this.format = 'alphanumeric';
        return this;
    }
    isAscii() {
        this.format = 'ascii';
        return this;
    }
    isBase64() {
        this.format = 'base64';
        return this;
    }
    isBefore(beforeDate) {
        throw ('Not implemented yet');
    }
    isBoolean() {
        this.format = 'boolean';
        return this;
    }
    isDate() {
        this.format = 'date';
        return this;
    }
    isDecimal() {
        this.format = 'decimal';
        return this;
    }
    isEmail() {
        this.format = 'email';
        return this;
    }
    isIBAN() {
        this.format = 'iban';
        return this;
    }
    isISO8601() {
        this.format = 'date';
        return this;
    }
    isJSON() {
        this.format = 'json';
        return this;
    }
    isNumeric() {
        this.format = 'numeric';
        return this;
    }
    isUUID() {
        this.format = 'uuid';
        return this;
    }
    isEmpty() {
        this.format = 'empty';
        return this;
    }
    isNotEmpty() {
        this.format = 'notempty';
        return this;
    }
    isCustom(format) {
        const name = `custom-${new Date().getTime()}`;
        ajvinstance_1.AjvInstance.addCustomFormat(name, format);
        this.format = name;
        return this;
    }
    withMessage(message) {
        // TODO: add custom message
        return this;
    }
}
exports.ValidationSchema = ValidationSchema;
