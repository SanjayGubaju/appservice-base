"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError {
    constructor(message) {
        this.name = 'ValidationError';
        this.message = message;
    }
}
exports.ValidationError = ValidationError;
class Validator {
    constructor() { }
    validate(validationFunc, query, body, params) {
        const errors = [];
        for (const contentName of validationFunc.requestcontenttype) {
            const content = contentName === 'query' || {} ? query : contentName === 'body' || {} ? body : params || {};
            if (!validationFunc.validate(content)) {
                errors.concat(validationFunc.validate.errors);
            }
        }
        if (errors.length) {
            return { errors: errors.join(',') };
        }
    }
}
exports.Validator = Validator;
