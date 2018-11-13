import { NextFunc } from '../../../server/types';
export declare class AjvValidationResolver {
    private constructor();
    static getValidationFunction(controllerClass: any, methodName: string, validationchain?: any): (request: any, response: any, done: NextFunc) => void;
    private static applyValidators;
    private static getContents;
    private static addValidationFunc;
}
