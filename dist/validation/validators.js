"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The supported validators are an subset of these
 * [validators]{@link https://github.com/chriso/validator.js#validators}.
 *
 * @export
 * @enum {number}
 */
var Validators;
(function (Validators) {
    /**
     * Check if the string contains only letters (a-zA-Z).
     */
    Validators["Alpha"] = "isAlpha";
    /**
     * Check if the string contains only letters and numbers.
     */
    Validators["Alphanumeric"] = "isAlphanumeric";
    /**
     * Check if the string contains ASCII chars only.
     */
    Validators["Ascii"] = "isAscii";
    /**
     * Check if a string is base64 encoded.
     */
    Validators["Base64"] = "isBase64";
    /**
     * Check if the string is a date that's before the specified date.
     */
    Validators["Before"] = "isBefore";
    /**
     * Check if a string is a boolean.
     */
    Validators["Boolean"] = "isBoolean";
    /**
     * Check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
     */
    Validators["Decimal"] = "isDecimal";
    /**
     * Check if the string is an email.
     */
    Validators["Email"] = "isEmail";
    /**
     * Check if the string is a float.
     */
    Validators["Float"] = "isFloat";
    /**
     * Check if the string is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
     */
    Validators["ISO8601"] = "isISO8601";
    /**
     * Check if the string is valid JSON (note: uses JSON.parse).
     */
    Validators["JSON"] = "isJSON";
    /**
     * Check if the string contains only numbers.
     */
    Validators["Numeric"] = "isNumeric";
    /**
     * Check if the string is a UUID (version 3, 4 or 5).
     */
    Validators["UUID"] = "isUUID";
})(Validators = exports.Validators || (exports.Validators = {}));
