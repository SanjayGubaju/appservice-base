"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validation/validators");
/**
 * Check if the parameter is empty or contains only letters (a-zA-Z).
 */
// tslint:disable-next-line:variable-name
exports.Validator_Alpha = { type: validators_1.Validators.Alpha };
/**
 * Check if the parameter is not empty and contains only letters (a-zA-Z).
 */
// tslint:disable-next-line:variable-name
exports.Validator_AlphaRequired = { required: true, type: validators_1.Validators.Alpha };
/**
 * Check if the parameter is empty or contains only letters and numbers.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Alphanumeric = { type: validators_1.Validators.Alphanumeric };
/**
 * Check if the parameter is not empty and contains only letters and numbers.
 */
// tslint:disable-next-line:variable-name
exports.Validator_AlphanumericRequired = { required: true, type: validators_1.Validators.Alphanumeric };
/**
 * Check if the parameter is empty or contains ASCII chars only.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Ascii = { type: validators_1.Validators.Ascii };
/**
 * Check if the parameter is not empty and contains ASCII chars only.
 */
// tslint:disable-next-line:variable-name
exports.Validator_AsciiRequired = { required: true, type: validators_1.Validators.Ascii };
/**
 * Check if the parameter is empty or base64 encoded.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Base64 = { type: validators_1.Validators.Base64 };
/**
 * Check if the parameter is not empty and base64 encoded.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Base64Required = { required: true, type: validators_1.Validators.Base64 };
/**
 * Check if the parameter is empty or a boolean.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Bool = { type: validators_1.Validators.Boolean };
/**
 * Check if the parameter is not empty and a boolean.
 */
// tslint:disable-next-line:variable-name
exports.Validator_BoolRequired = { required: true, type: validators_1.Validators.Boolean };
/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Date = { type: validators_1.Validators.ISO8601 };
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
exports.Validator_DateRequired = { required: true, type: validators_1.Validators.ISO8601 };
/**
 * Check if the parameter is empty or represents a decimal number.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Decimal = { type: validators_1.Validators.Decimal };
/**
 * Check if the parameter is not empty and represents a decimal number.
 */
// tslint:disable-next-line:variable-name
exports.Validator_DecimalRequired = { required: true, type: validators_1.Validators.Decimal };
/**
 * Check if the parameter is empty or is an email.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Email = { type: validators_1.Validators.Email };
/**
 * Check if the parameter is not empty and is an email.
 */
// tslint:disable-next-line:variable-name
exports.Validator_EmailRequired = { required: true, type: validators_1.Validators.Email };
/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
exports.Validator_ISO8601 = { type: validators_1.Validators.ISO8601 };
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
exports.Validator_ISO8601Required = { required: true, type: validators_1.Validators.ISO8601 };
/**
 * Check if the parameter is empty or is valid JSON (simple RegExp check).
 */
// tslint:disable-next-line:variable-name
exports.Validator_Json = { type: validators_1.Validators.JSON };
/**
 * Check if the parameter is not empty and is valid JSON (simple RegExp check).
 */
// tslint:disable-next-line:variable-name
exports.Validator_JSONRequired = { required: true, type: validators_1.Validators.JSON };
/**
 * Check if the parameter is not empty if it exists.
 */
// tslint:disable-next-line:variable-name
exports.Validator_NotEmpty = {};
/**
 * Check if the parameter is empty or contains only numbers.
 */
// tslint:disable-next-line:variable-name
exports.Validator_Numeric = { type: validators_1.Validators.Numeric };
/**
 * Check if the parameter is not empty and contains only numbers.
 */
// tslint:disable-next-line:variable-name
exports.Validator_NumericRequired = { required: true, type: validators_1.Validators.Numeric };
/**
 * Check if the parameter exist (with any value or empty).
 */
// tslint:disable-next-line:variable-name
exports.Validator_Required = { required: true };
/**
 * Check if the parameter is empty or is a UUID.
 */
// tslint:disable-next-line:variable-name
exports.Validator_UUID = { type: validators_1.Validators.UUID };
/**
 * Check if the parameter is not empty and is a UUID.
 */
// tslint:disable-next-line:variable-name
exports.Validator_UUIDRequired = { required: true, type: validators_1.Validators.UUID };
