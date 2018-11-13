import { ValidationFunc } from './validationschema';
export declare class ValidationError implements Error {
    readonly name: string;
    readonly message: string;
    readonly stack?: string | undefined;
    constructor(message: string);
}
export declare class Validator {
    constructor();
    validate(validationFunc: ValidationFunc, query: any, body: any, params: any): {
        errors?: any;
    } | undefined;
}
