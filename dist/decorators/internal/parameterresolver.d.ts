import { Request, Response } from 'express';
import { ParamDescriptor } from './parameter.decorator';
export declare class ParameterResolver {
    private constructor();
    static resolveParams(request: Request, response: Response, controllerClass: any, methodName: string): any[];
    static getParams(controllerClass: any, methodName: string): ParamDescriptor[];
}
