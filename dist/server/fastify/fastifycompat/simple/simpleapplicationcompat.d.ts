import { Application } from 'express';
import { FastifyServer } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';
export declare class SimpleApplicationCompat extends AbstractCompatProxy {
    private fastifyApplication;
    private app;
    private props;
    protected constructor(fastifyApplication: FastifyServer);
    static getInstance(fastifyApplication: FastifyServer): any;
    static getProxyInstance(fastifyApplication: FastifyServer): any;
    protected getBaseHttpClass(): any;
    set(name: any, value: any): Application;
    get(name: any): any;
}
