import { CookieOptions, Errback, Response } from 'express';
import { Application } from 'express-serve-static-core';
import { FastifyResp } from '../../../types';
import { SimpleResponseCompat } from '../simple/simpleresponsecompat';
export declare class ResponseCompat extends SimpleResponseCompat {
    private constructor();
    static getInstance(fastifyResponse: FastifyResp, app: Application): any;
    static getProxyInstance(fastifyResponse: FastifyResp, app: Application): any;
    links(links: any): Response;
    jsonp(data?: any): Response;
    sendFile(path: string, errorCallbackOrOptions?: Errback | any, errorCallback?: Errback): void;
    download(path: string, filenameOrErrorCallback?: string | Errback, errorCallback?: Errback): void;
    format(obj: any): Response;
    attachment(filename?: string): Response;
    clearCookie(name: string, options?: any): Response;
    cookie(name: string, value: any, options?: CookieOptions): Response;
    location(url: string): Response;
    render(view: string, options?: Object, callback?: (err: Error, html: string) => void): void;
    append(field: string, value?: string[] | string): Response;
    vary(field: string): Response;
}
