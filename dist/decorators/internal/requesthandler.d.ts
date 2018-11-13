import { Request, Response } from 'express';
export declare class RequestHandler {
    private controllerClass;
    private methodName;
    private request;
    private response;
    private originalMethod;
    private statusSuccess;
    private statusError;
    private type;
    private skipValidation;
    constructor(controllerClass: any, methodName: string, request: Request, response: Response, originalMethod: () => {}, statusSuccess: number, statusError: number, type: string, skipValidation?: boolean);
    executeRequest(): Promise<void>;
    private sendResponse;
    private sendJson;
    private validateRequestParams;
    private isJson;
    private escapeHtml;
}
