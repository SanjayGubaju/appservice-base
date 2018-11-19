import * as ajv from 'ajv';
export declare enum RequestContentType {
    QUERY = "query",
    PARAMS = "params",
    BODY = "body"
}
export interface ValidationFunc {
    requestcontenttype: string[];
    validate: ajv.ValidateFunction;
}
export declare class ValidationSchema {
    private ajv;
    private readonly requestContentTypes;
    private isRequired;
    private fieldName;
    private format;
    private constructor();
    static check(name: string): ValidationSchema;
    useRequestContent(...requestContentNames: RequestContentType[]): ValidationSchema;
    getValidationFunc(): ValidationFunc;
    required(): ValidationSchema;
    isAlpha(): ValidationSchema;
    isAlphanumeric(): ValidationSchema;
    isAscii(): ValidationSchema;
    isBase64(): ValidationSchema;
    isBefore(beforeDate?: string): ValidationSchema;
    isBoolean(): ValidationSchema;
    isDate(): ValidationSchema;
    isDecimal(): ValidationSchema;
    isEmail(): ValidationSchema;
    isIBAN(): ValidationSchema;
    isISO8601(): ValidationSchema;
    isJSON(): ValidationSchema;
    isNumeric(): ValidationSchema;
    isUUID(): ValidationSchema;
    isEmpty(): ValidationSchema;
    isNotEmpty(): ValidationSchema;
    isCustom(format: (value: any) => boolean): ValidationSchema;
    withMessage(message: string): ValidationSchema;
}
