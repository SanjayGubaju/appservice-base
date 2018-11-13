import { Express } from 'express';
import { DefaultHeaders } from 'fastify';
import { IHelmetContentSecurityPolicyDirectives } from 'helmet';
import { PassportStrategy } from '../auth/passport/passportstrategy';
import { Endpoint } from './endpoint';
import { FastifyServer, Middleware } from './types';
import { CorsOptions } from 'cors';
import { Server } from './server';
export declare abstract class AbstractServer implements Server {
    protected baseServer: Express | FastifyServer;
    protected corsServerUri: string | string[];
    static readonly DEFAULT_PORT: number;
    private isContentSecurityPolicyDisabled;
    private middlewares;
    private staticEndpoints;
    private passportStrategies;
    private isShutdownCalled;
    private isStarted;
    private server;
    protected constructor(baseServer: Express | FastifyServer, corsServerUri?: string | string[]);
    startServer(): void;
    addMiddleware(path: any, handler: Middleware): void;
    addStaticFiles(directory: string, endpoint?: string, index?: string, allowInsecureContent?: boolean, directives?: IHelmetContentSecurityPolicyDirectives): void;
    /**
     * Add controller that may handle request routes.
     *
     * It is expected these controllers are using annotations from {@link RoutingDecorator} to
     * configure the routes they are responsible for.
     *
     * @param {*} controller
     * @memberof AbstractExpressServer
     */
    addController(controller: any): void;
    addPassportStrategy(path: string, strategy: PassportStrategy): void;
    disableContentSecurityPolicy(): void;
    protected abstract beforeStart(): void;
    protected abstract start(): void;
    protected abstract stop(): Promise<void>;
    protected abstract shutdown(): Promise<void>;
    protected abstract initDefaultHeaders(): void;
    protected abstract initCors(options: CorsOptions): void;
    protected abstract initCompression(): void;
    protected abstract initBodyParser(): void;
    protected abstract initPassportStrategies(passportStrategies: {
        path: string;
        strategy: PassportStrategy;
    }[]): void;
    protected abstract initRoutes(): void;
    protected abstract initStaticEndpoints(staticEndpoints: Endpoint[]): void;
    protected initLogger(): void;
    protected initMiddlewares(): void;
    protected prepareDefaultHeaders(): DefaultHeaders;
    private getCorsOptions;
    private prepareHeaders;
    protected getSetHeadersFunc(staticEndpoint: Endpoint): any;
    protected getCSPHeader(staticEndpoint: Endpoint): any | undefined;
    private prepareDirective;
    private initShutdownListener;
    private stopServer;
}
