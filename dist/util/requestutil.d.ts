import { Request } from 'express';
export declare class RequestUtil {
    private constructor();
    static getParameter(name: string, request: Request): any;
    static getPathParameter(name: string, request: Request): any;
}
