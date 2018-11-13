export declare enum Type {
    Array = "array",
    Boolean = "boolean",
    Date = "date",
    Error = "error",
    Function = "function",
    JsonString = "jsonstring",
    Number = "number",
    Object = "object",
    RegExp = "regexp",
    String = "string",
    Undefined = "undefined",
    Unknown = "unknown"
}
export declare class DataType {
    static getType(value: any): Type;
    static isArray(value: any): boolean;
    static isBoolean(value: any): boolean;
    static isDate(value: any): boolean;
    static isError(value: any): boolean;
    static isFunction(value: any): boolean;
    static isJsonString(value: any): boolean;
    static isNumber(value: any): boolean;
    static isObject(value: any): boolean;
    static isRegExp(value: any): boolean;
    static isString(value: any): boolean;
    static isUndefined(value: any): boolean;
}
