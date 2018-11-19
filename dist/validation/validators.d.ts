/**
 * The supported validators are an subset of these
 * [validators]{@link https://github.com/chriso/validator.js#validators}.
 *
 * @export
 * @enum {number}
 */
export declare enum Validators {
    /**
     * Check if the string contains only letters (a-zA-Z).
     */
    Alpha = "isAlpha",
    /**
     * Check if the string contains only letters and numbers.
     */
    Alphanumeric = "isAlphanumeric",
    /**
     * Check if the string contains ASCII chars only.
     */
    Ascii = "isAscii",
    /**
     * Check if a string is base64 encoded.
     */
    Base64 = "isBase64",
    /**
     * Check if the string is a date that's before the specified date.
     */
    Before = "isBefore",
    /**
     * Check if a string is a boolean.
     */
    Boolean = "isBoolean",
    /**
     * Check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
     */
    Decimal = "isDecimal",
    /**
     * Check if the string is an email.
     */
    Email = "isEmail",
    /**
     * Check if the string is a float.
     */
    Float = "isFloat",
    /**
     * Check if the string is a valid IBAN.
     */
    IBAN = "isIBAN",
    /**
     * Check if the string is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
     */
    ISO8601 = "isISO8601",
    /**
     * Check if the string is valid JSON (note: uses JSON.parse).
     */
    JSON = "isJSON",
    /**
     * Check if the string contains only numbers.
     */
    Numeric = "isNumeric",
    /**
     * Check if the string is a UUID (version 3, 4 or 5).
     */
    UUID = "isUUID"
}
export interface Validation {
    required?: boolean;
    message?: string;
    type?: Validators;
    custom?: (value: any) => boolean;
}
