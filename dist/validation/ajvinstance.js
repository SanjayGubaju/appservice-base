"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
const iban = require("iban");
class AjvInstance {
    constructor() { }
    static getInstance() {
        if (!AjvInstance.ajv) {
            AjvInstance.init();
        }
        return AjvInstance.ajv;
    }
    static addCustomFormat(name, format) {
        AjvInstance.ajv.addFormat(name, value => format(value));
    }
    static init() {
        AjvInstance.ajv = new ajv({ allErrors: true });
        AjvInstance.addCustomFormats();
    }
    static addCustomFormats() {
        AjvInstance.ajv.addFormat('alpha', value => /^[\p{Letter}]+$/u.test(value));
        AjvInstance.ajv.addFormat('alphanumeric', /^[\p{Letter}\p{Number}]+$/u);
        AjvInstance.ajv.addFormat('ascii', /^[\x00-\x7F]+$/);
        AjvInstance.ajv.addFormat('base64', /^(?:[A-Z0-9+\/]{4})+={0,2}$/i);
        // AjvInstance.ajv.addFormat('before', { compare: (input, comparedate) => {
        //   return new Date(input).getTime() < (compare  ? new Date(compare) : new Date()).getTime();
        // }, type: 'string' });
        AjvInstance.ajv.addFormat('boolean', value => ['true', 'false', '1', '0'].includes(value));
        // tslint:disable-next-line:max-line-length
        AjvInstance.ajv.addFormat('decimal', /[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/);
        // tslint:disable-next-line:max-line-length
        // this.ajv.addFormat('iso8601', { validate: value => /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/.test(value), type: 'string' });
        AjvInstance.ajv.addFormat('json', value => /^[\],:{}\s]*$/
            .test(value
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
        AjvInstance.ajv.addFormat('numeric', /^[+-]?(\d*[.])?\d+$/);
        AjvInstance.ajv.addFormat('notempty', value => value.trim().length > 0);
        // tslint:disable-next-line:max-line-length
        AjvInstance.ajv.addFormat('iban', value => iban.isValid(value.trim()));
    }
}
exports.AjvInstance = AjvInstance;
