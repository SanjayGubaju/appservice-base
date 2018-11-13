import { Application } from 'express';
import { FastifyRequest } from 'fastify';
import { FastifyReq } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';
export declare class SimpleRequestCompat extends AbstractCompatProxy {
    protected fastifyRequest: FastifyRequest<any, any, any, any, any>;
    protected app: Application;
    private req;
    protected body: any;
    protected params: any;
    protected query: any;
    protected headers: any;
    protected path: string;
    protected response: Response;
    protected constructor(fastifyRequest: FastifyRequest<any, any, any, any, any>, app: Application);
    static getInstance(fastifyRequest: FastifyReq, app: Application): any;
    static getProxyInstance(fastifyRequest: FastifyReq, app: Application): any;
    setResponse(response: Response): void;
    protected getBaseHttpClass(): any;
    accepts(type: string): boolean;
}
