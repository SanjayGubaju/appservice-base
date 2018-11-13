/// <reference types="node" />
import * as http from 'http';
import { CorsOptions } from 'cors';
import { Express } from 'express';
import { PassportStrategy } from '../../auth/passport/passportstrategy';
import { AbstractServer } from '../abstractserver';
import { Endpoint } from '../endpoint';
export declare class ExpressServer extends AbstractServer {
    private port;
    private env;
    protected express: Express;
    protected httpServer: http.Server;
    constructor(port?: number, env?: string, corsServerUri?: string | string[]);
    startServer(): void;
    protected start(): void;
    protected beforeStart(): void;
    protected shutdown(): Promise<void>;
    protected initDefaultHeaders(): void;
    private isStaticHeaders;
    /**
     * Adds and configures the following middleware:
     *
     * * cors
     *
     * @protected
     * @memberof AbstractExpressServer
     */
    protected initCors(options: CorsOptions): void;
    protected initCompression(): void;
    protected initBodyParser(): void;
    protected initPassportStrategies(passportStrategies: {
        path: string;
        strategy: PassportStrategy;
    }[]): void;
    protected initRoutes(): void;
    protected initStaticEndpoints(staticEndpoints: Endpoint[]): void;
    protected stop(): Promise<void>;
}
