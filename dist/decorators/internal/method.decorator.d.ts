import { RequestHandler as ExpressRequestHandler } from 'express';
export interface RequestOptions {
    validation?: ExpressRequestHandler[];
    success?: number;
    error?: number;
    type?: string;
}
export declare class MethodDecorator {
    private constructor();
    static getDecoratorFunc(route: string, httpMethod: string, options?: RequestOptions): (controllerClass: any, methodName: string, descriptor: PropertyDescriptor) => void;
    private static addRoute;
    private static createRoutingFunc;
    private static createFastifyRoutingFunc;
}
