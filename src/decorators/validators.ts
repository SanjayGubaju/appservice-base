import { Validation, Validators } from '../validation/validators';

/**
 * Check if the parameter is empty or contains only letters (a-zA-Z).
 */
// tslint:disable-next-line:variable-name
export const Validator_Alpha: Validation = { type: Validators.Alpha };
/**
 * Check if the parameter is not empty and contains only letters (a-zA-Z).
 */
// tslint:disable-next-line:variable-name
export const Validator_AlphaRequired: Validation = { required: true, type: Validators.Alpha };

/**
 * Check if the parameter is empty or contains only letters and numbers.
 */
// tslint:disable-next-line:variable-name
export const Validator_Alphanumeric: Validation = { type: Validators.Alphanumeric };
/**
 * Check if the parameter is not empty and contains only letters and numbers.
 */
// tslint:disable-next-line:variable-name
export const Validator_AlphanumericRequired: Validation = { required: true, type: Validators.Alphanumeric };

/**
 * Check if the parameter is empty or contains ASCII chars only.
 */
// tslint:disable-next-line:variable-name
export const Validator_Ascii: Validation = { type: Validators.Ascii };
/**
 * Check if the parameter is not empty and contains ASCII chars only.
 */
// tslint:disable-next-line:variable-name
export const Validator_AsciiRequired: Validation = { required: true, type: Validators.Ascii };

/**
 * Check if the parameter is empty or base64 encoded.
 */
// tslint:disable-next-line:variable-name
export const Validator_Base64: Validation = { type: Validators.Base64 };
/**
 * Check if the parameter is not empty and base64 encoded.
 */
// tslint:disable-next-line:variable-name
export const Validator_Base64Required: Validation = { required: true, type: Validators.Base64 };

/**
 * Check if the parameter is empty or a boolean.
 */
// tslint:disable-next-line:variable-name
export const Validator_Bool: Validation = { type: Validators.Boolean };
/**
 * Check if the parameter is not empty and a boolean.
 */
// tslint:disable-next-line:variable-name
export const Validator_BoolRequired: Validation = { required: true, type: Validators.Boolean };

/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
export const Validator_Date: Validation = { type: Validators.ISO8601 };
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
export const Validator_DateRequired: Validation = { required: true, type: Validators.ISO8601 };

/**
 * Check if the parameter is empty or represents a decimal number.
 */
// tslint:disable-next-line:variable-name
export const Validator_Decimal: Validation = { type: Validators.Decimal };
/**
 * Check if the parameter is not empty and represents a decimal number.
 */
// tslint:disable-next-line:variable-name
export const Validator_DecimalRequired: Validation = { required: true, type: Validators.Decimal };

/**
 * Check if the parameter is empty or is an email.
 */
// tslint:disable-next-line:variable-name
export const Validator_Email: Validation = { type: Validators.Email };
/**
 * Check if the parameter is not empty and is an email.
 */
// tslint:disable-next-line:variable-name
export const Validator_EmailRequired: Validation = { required: true, type: Validators.Email };

/**
 * Check if the parameter is empty or is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
export const Validator_ISO8601: Validation = { type: Validators.ISO8601 };
/**
 * Check if the parameter is not empty and is a valid [ISO 8601]{@link https://en.wikipedia.org/wiki/ISO_8601} date.
 */
// tslint:disable-next-line:variable-name
export const Validator_ISO8601Required: Validation = { required: true, type: Validators.ISO8601 };

/**
 * Check if the parameter is empty or is valid JSON (simple RegExp check).
 */
// tslint:disable-next-line:variable-name
export const Validator_Json: Validation = { type: Validators.JSON };
/**
 * Check if the parameter is not empty and is valid JSON (simple RegExp check).
 */
// tslint:disable-next-line:variable-name
export const Validator_JSONRequired: Validation = { required: true, type: Validators.JSON };

/**
 * Check if the parameter is not empty if it exists.
 */
// tslint:disable-next-line:variable-name
export const Validator_NotEmpty: Validation = {};

/**
 * Check if the parameter is empty or contains only numbers.
 */
// tslint:disable-next-line:variable-name
export const Validator_Numeric: Validation = { type: Validators.Numeric };
/**
 * Check if the parameter is not empty and contains only numbers.
 */
// tslint:disable-next-line:variable-name
export const Validator_NumericRequired: Validation = { required: true, type: Validators.Numeric };

/**
 * Check if the parameter exist (with any value or empty).
 */
// tslint:disable-next-line:variable-name
export const Validator_Required = { required: true };

/**
 * Check if the parameter is empty or is a UUID.
 */
// tslint:disable-next-line:variable-name
export const Validator_UUID: Validation = { type: Validators.UUID };

/**
 * Check if the parameter is empty or is a valid IBAN.
 */
// tslint:disable-next-line:variable-name
export const Validator_IBAN: Validation = { type: Validators.IBAN };

/**
 * Check if the parameter is not empty and is a valid IBAN.
 */
// tslint:disable-next-line:variable-name
export const Validator_IBANRequired: Validation = { required: true, type: Validators.IBAN };

/**
 * Check if the parameter is not empty and is a UUID.
 */
// tslint:disable-next-line:variable-name
export const Validator_UUIDRequired: Validation = { required: true, type: Validators.UUID };
