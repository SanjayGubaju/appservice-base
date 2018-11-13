import { Validation } from '../validation/validators';
/**
 * Check if the parameter is empty or contains only letters (a-zA-Z).
 */
export declare const Validator_Alpha: Validation;
/**
 * Check if the parameter is not empty and contains only letters (a-zA-Z).
 */
export declare const Validator_AlphaRequired: Validation;
/**
 * Check if the parameter is empty or contains only letters and numbers.
 */
export declare const Validator_Alphanumeric: Validation;
/**
 * Check if the parameter is not empty and contains only letters and numbers.
 */
export declare const Validator_AlphanumericRequired: Validation;
/**
 * Check if the parameter is empty or contains ASCII chars only.
 */
export declare const Validator_Ascii: Validation;
/**
 * Check if the parameter is not empty and contains ASCII chars only.
 */
export declare const Validator_AsciiRequired: Validation;
/**
 * Check if the parameter is empty or base64 encoded.
 */
export declare const Validator_Base64: Validation;
/**
 * Check if the parameter is not empty and base64 encoded.
 */
export declare const Validator_Base64Required: Validation;
/**
 * Check if the parameter is empty or a boolean.
 */
export declare const Validator_Bool: Validation;
/**
 * Check if the parameter is not empty and a boolean.
 */
export declare const Validator_BoolRequired: Validation;
/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
export declare const Validator_Date: Validation;
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
export declare const Validator_DateRequired: Validation;
/**
 * Check if the parameter is empty or represents a decimal number.
 */
export declare const Validator_Decimal: Validation;
/**
 * Check if the parameter is not empty and represents a decimal number.
 */
export declare const Validator_DecimalRequired: Validation;
/**
 * Check if the parameter is empty or is an email.
 */
export declare const Validator_Email: Validation;
/**
 * Check if the parameter is not empty and is an email.
 */
export declare const Validator_EmailRequired: Validation;
/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
export declare const Validator_ISO8601: Validation;
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
export declare const Validator_ISO8601Required: Validation;
/**
 * Check if the parameter is empty or is valid JSON (simple RegExp check).
 */
export declare const Validator_Json: Validation;
/**
 * Check if the parameter is not empty and is valid JSON (simple RegExp check).
 */
export declare const Validator_JSONRequired: Validation;
/**
 * Check if the parameter is not empty if it exists.
 */
export declare const Validator_NotEmpty: Validation;
/**
 * Check if the parameter is empty or contains only numbers.
 */
export declare const Validator_Numeric: Validation;
/**
 * Check if the parameter is not empty and contains only numbers.
 */
export declare const Validator_NumericRequired: Validation;
/**
 * Check if the parameter exist (with any value or empty).
 */
export declare const Validator_Required: {
    required: boolean;
};
/**
 * Check if the parameter is empty or is a UUID.
 */
export declare const Validator_UUID: Validation;
/**
 * Check if the parameter is not empty and is a UUID.
 */
export declare const Validator_UUIDRequired: Validation;
