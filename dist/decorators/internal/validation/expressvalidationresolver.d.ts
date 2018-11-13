import { RequestHandler } from 'express';
export declare class ExpressValidationResolver {
    private constructor();
    static getValidationRules(controllerClass: any, methodName: string, validationchain?: RequestHandler[]): RequestHandler[];
    private static expandValidationFunc;
}
