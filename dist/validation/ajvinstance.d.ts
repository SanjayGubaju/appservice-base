import * as ajv from 'ajv';
export declare class AjvInstance {
    private constructor();
    private static ajv;
    static getInstance(): ajv.Ajv;
    private static init;
    private static addCustomFormats;
}
