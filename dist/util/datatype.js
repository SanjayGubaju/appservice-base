"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type["Array"] = "array";
    Type["Boolean"] = "boolean";
    Type["Date"] = "date";
    Type["Error"] = "error";
    Type["Function"] = "function";
    Type["JsonString"] = "jsonstring";
    Type["Number"] = "number";
    Type["Object"] = "object";
    Type["RegExp"] = "regexp";
    Type["String"] = "string";
    Type["Undefined"] = "undefined";
    Type["Unknown"] = "unknown";
})(Type = exports.Type || (exports.Type = {}));
class DataType {
    static getType(value) {
        if (DataType.isUndefined(value)) {
            return Type.Undefined;
        }
        if (DataType.isJsonString(value)) {
            return Type.JsonString;
        }
        if (DataType.isString(value)) {
            return Type.String;
        }
        if (DataType.isObject(value)) {
            return Type.Object;
        }
        if (DataType.isNumber(value)) {
            return Type.Number;
        }
        if (DataType.isArray(value)) {
            return Type.Array;
        }
        if (DataType.isBoolean(value)) {
            return Type.Boolean;
        }
        if (DataType.isDate(value)) {
            return Type.Date;
        }
        if (DataType.isError(value)) {
            return Type.Error;
        }
        if (DataType.isFunction(value)) {
            return Type.Function;
        }
        if (DataType.isRegExp(value)) {
            return Type.RegExp;
        }
        return Type.Unknown;
    }
    static isArray(value) {
        return Array.isArray(value);
    }
    static isBoolean(value) {
        return typeof value === 'boolean' || value instanceof Boolean;
    }
    static isDate(value) {
        return value instanceof Date;
    }
    static isError(value) {
        return value instanceof Error && typeof value.message !== 'undefined';
    }
    static isFunction(value) {
        return typeof value === 'function';
    }
    static isJsonString(value) {
        try {
            return DataType.isString(value) && JSON.parse(value);
        }
        catch (e) { }
        return false;
    }
    static isNumber(value) {
        return Number.isFinite(value);
    }
    static isObject(value) {
        return value && typeof value === 'object' && (value.constructor === Object
            || (!DataType.isArray(value) && !DataType.isRegExp(value)
                && !DataType.isUndefined(value) && !DataType.isDate(value)
                && !DataType.isNumber(value) && !DataType.isError(value)));
    }
    static isRegExp(value) {
        return value && typeof value === 'object' && value.constructor === RegExp;
    }
    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    static isUndefined(value) {
        return value === null || typeof value === 'undefined';
    }
}
exports.DataType = DataType;
