import { CorsOptions } from 'cors';
import { Application } from 'express';
import { PassportStrategy } from '../../auth/passport/passportstrategy';
import { AbstractServer } from '../abstractserver';
import { Endpoint } from '../endpoint';
import { ExpressMiddleware, FastifyServer as FastifyServerApp } from '../types';
export declare class FastifyServer extends AbstractServer {
    private port;
    private env;
    protected fastifyServer: FastifyServerApp;
    protected app: Application;
    private middlewarescompat;
    constructor(port?: number, env?: string, corsServerUri?: string | string[]);
    addMiddlewareCompat(pathOrHandler: string | ExpressMiddleware, handler?: ExpressMiddleware | null): void;
    protected start(): void;
    protected beforeStart(): void;
    protected shutdown(): Promise<void>;
    protected initDefaultHeaders(): void;
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
    protected stop(): Promise<void>;
    protected initStaticEndpoints(staticEndpoints: Endpoint[]): void;
    protected initCompatMiddlewares(): void;
    private getCompatApplicationLayer;
    private getCompatRequestLayer;
    private getCompatResponseLayer;
}
