import { Validation } from '../../validation/validators';
export interface ParamDescriptor {
    index: number;
    name?: string;
    validation?: Validation;
    paramtype: ParamType;
}
export declare enum ParamType {
    QUERYPARAM = "queryparam",
    PATHPARAM = "pathparam",
    REQUEST = "request",
    RESPONSE = "response",
    USER = "user"
}
export declare class ParameterDecorator {
    static readonly PARAMETERMETADATA: string;
    static getDecoratorFunc(paramType: ParamType, paramName?: string, validation?: Validation): (controllerClass: any, methodName: string, index: number) => void;
    private static initTargetObject;
    /**
     * Return a unique key in the form 'decoratortype@classname@methodname' that is used to store the
     * metadata  for parameters with decorators in a transfer object ('target')
     *
     * @static
     * @param {string} paramType
     * @param {*} controllerClass
     * @param {string} methodName
     * @returns {string}
     * @memberof ParamDecorator
     */
    static createKey(paramType: string, controllerClass: any, methodName: string): string;
}
