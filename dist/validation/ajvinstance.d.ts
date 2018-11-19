import * as ajv from 'ajv';
export declare class AjvInstance {
    private constructor();
    private static ajv;
    static getInstance(): ajv.Ajv;
    static addCustomFormat(name: string, format: (value: any) => boolean): void;
    private static init;
    private static addCustomFormats;
}
