/// <reference types="node" />
import { ServerResponse } from 'http';
import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import { FastifyResp } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';
export declare class SimpleResponseCompat extends AbstractCompatProxy {
    protected fastifyResponse: FastifyResp;
    protected app: Application;
    protected useProxy: boolean;
    protected request: Request;
    protected readonly res: ServerResponse;
    protected statusCode: number;
    protected constructor(fastifyResponse: FastifyResp, app: Application, useProxy?: boolean);
    static getInstance(fastifyResponse: FastifyResp, app: Application, useProxy?: boolean): any;
    static getProxyInstance(fastifyResponse: FastifyResp, app: Application): any;
    setRequest(request: Request): void;
    protected getBaseHttpClass(): any;
    status(statusCode: number): Response;
    sendStatus(statusCode: number): Response;
    send(body?: any): Response;
    json(body?: any): Response;
    contentType(type: string): Response;
    type(type: string): Response;
    set(field: string | any, value?: string): Response;
    header(field: string | any, value?: string): Response;
    setHeader(field: string | any, value?: string): Response;
    get(name: string): string;
    redirect(url: string | number, status?: number | string): void;
    end(callback?: () => void): void;
}
