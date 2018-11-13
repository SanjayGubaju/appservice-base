import { error, info } from 'console';

import { Express } from 'express';
import { DefaultHeaders } from 'fastify';
import { IHelmetContentSecurityPolicyDirectives } from 'helmet';

import { PassportStrategy } from '../auth/passport/passportstrategy';
import { Configuration } from '../config/config';
import { ClassDecorator } from '../decorators/internal/class.decorator';
import { WinstonLogger } from '../logger/winstonlogger';
import { Endpoint } from './endpoint';
import { InternalServer } from './internalserver';
import { FastifyServer, Middleware, NextFunc } from './types';

import { CorsOptions } from 'cors';
import { Server } from './server';

const contentSecurityPolicyBuilder = require('content-security-policy-builder');

export abstract class AbstractServer implements Server {

  public static readonly DEFAULT_PORT: number = 3000;

  private isContentSecurityPolicyDisabled!: boolean;
  private middlewares: { path: any; handler: Middleware; }[];
  private staticEndpoints: Endpoint[];
  private passportStrategies: { path: string; strategy: PassportStrategy; }[];
  private isShutdownCalled: boolean = false;
  private isStarted!: boolean;

  private server: InternalServer;

  protected constructor(protected baseServer: Express | FastifyServer,
                        protected corsServerUri: string | string[] = '*') {
    this.server = <InternalServer>baseServer;
    this.middlewares = [];
    this.staticEndpoints = [];
    this.passportStrategies = [];
  }

  public startServer(): void {
    if (!this.isStarted) {
      this.isStarted = true;
      this.initDefaultHeaders();
      this.initLogger();
      this.initCors(this.getCorsOptions());
      this.initCompression();
      this.initBodyParser();
      this.initPassportStrategies(this.passportStrategies);
      this.initMiddlewares();
      this.initRoutes();
      this.initStaticEndpoints(this.staticEndpoints);
      this.initShutdownListener();

      this.beforeStart();

      this.start();
    }
  }

  public addMiddleware(path: any, handler: Middleware): void {
    this.middlewares.push({ path, handler });
  }

  public addStaticFiles(directory: string,
                        endpoint?: string,
                        index: string = 'index.html',
                        allowInsecureContent: boolean = false,
                        directives?: IHelmetContentSecurityPolicyDirectives): void {
    this.staticEndpoints.push({
      index,
      directives,
      path: endpoint || '/',
      dir: directory,
      insecureContent: allowInsecureContent,
    });
  }

  /**
   * Add controller that may handle request routes.
   *
   * It is expected these controllers are using annotations from {@link RoutingDecorator} to
   * configure the routes they are responsible for.
   *
   * @param {*} controller
   * @memberof AbstractExpressServer
   */
  public addController(controller: any): void {
    ClassDecorator.addController(controller);
  }

  public addPassportStrategy(path: string, strategy: PassportStrategy): void {
    this.passportStrategies.push({ path, strategy });
  }

  public disableContentSecurityPolicy(): void {
    this.isContentSecurityPolicyDisabled = true;
  }

  protected abstract beforeStart(): void;
  protected abstract start(): void;
  protected abstract async stop(): Promise<void>;
  protected abstract async shutdown(): Promise<void>;
  protected abstract initDefaultHeaders(): void;
  protected abstract initCors(options: CorsOptions): void;
  protected abstract initCompression(): void;
  protected abstract initBodyParser(): void;
  protected abstract initPassportStrategies(passportStrategies: { path: string; strategy: PassportStrategy; }[]): void;
  protected abstract initRoutes(): void;
  protected abstract initStaticEndpoints(staticEndpoints: Endpoint[]): void;

  protected initLogger(): void {
    if (Configuration.getBoolean('ENABLE_SERVER_LOG')) {
      const logger = WinstonLogger.getServerLogger();
      this.server.use((req: any, res: any, done: NextFunc) => {
        logger(req, res, done);
      });
    }
  }

  protected initMiddlewares(): void {
    for (const middleware of this.middlewares) {
      this.server.use(middleware.path, middleware.handler);
    }
  }

  protected prepareDefaultHeaders(): DefaultHeaders {
    const defHeaders = Configuration.getObject('DEFAULT_HTTP_HEADERS') || {};
    const defStaticHeaders = { ...defHeaders, ...(Configuration.getObject('DEFAULT_HTTP_HEADERS_STATIC') || {}) };
    return {
      headers: this.prepareHeaders(defHeaders),
      staticHeaders: this.prepareHeaders(defStaticHeaders),
    };
  }

  private getCorsOptions(): CorsOptions {
    return {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: this.corsServerUri,
      preflightContinue: false,
    };
  }

  private prepareHeaders(headers: any): string[][] {
    const headersMap: string[][] = [];
    for (const name in headers) {
      if (name === 'Content-Security-Policy') {
        headersMap.push([name, contentSecurityPolicyBuilder({ directives: headers[name] })]);
      } else {
        headersMap.push([name, headers[name]]);
      }
    }
    return headersMap;
  }

  protected getSetHeadersFunc(staticEndpoint: Endpoint): any {
    const cspHeader = this.getCSPHeader(staticEndpoint);
    return cspHeader
      ? (response: any, path: string, stat: any) => {
        if (path.endsWith('.html') || path.endsWith('.htm') || /\/[^\/\.]$/.test(path)) {
          response.setHeader('Content-Security-Policy', cspHeader);
        }
      }
      : cspHeader;
  }

  protected getCSPHeader(staticEndpoint: Endpoint): any | undefined {
    if (this.isContentSecurityPolicyDisabled || !staticEndpoint.directives) {
      return undefined;
    }
    return contentSecurityPolicyBuilder({ directives: this.prepareDirective(staticEndpoint) });
  }

  private prepareDirective(endpoint?: Endpoint): IHelmetContentSecurityPolicyDirectives {
    if (!endpoint || (!endpoint.directives && !endpoint.insecureContent)) {
      return {
        defaultSrc: ["'self'"],
      };
    }

    const directives = endpoint.directives || { defaultSrc: ["'self'"] };
    if (!directives.defaultSrc) {
      directives.defaultSrc = ["'self'"];
    }
    if (endpoint.insecureContent) {
      directives.scriptSrc = directives.scriptSrc
        ? [...directives.scriptSrc, "'unsafe-eval'", "'unsafe-inline'"]
        : ["'self'", "'unsafe-eval'", "'unsafe-inline'"];
      directives.styleSrc = directives.styleSrc
        ? [...directives.styleSrc, "'unsafe-inline'"]
        : ["'self'", "'unsafe-inline'"];
    }
    return directives;
  }

  private initShutdownListener(): void {
    process.once('SIGINT', async (): Promise<void> => {
      await this.stopServer('SIGINT');
    });
    process.once('SIGTERM', async (): Promise<void> => {
      await this.stopServer('SIGTERM');
    });
    process.once('SIGUSR2', async (): Promise<void> => {
      await this.stopServer('SIGUSR2', false);
    });
  }

  private async stopServer(signal: string, stopProcess: boolean = true): Promise<void> {
    if (!this.isShutdownCalled) {
      info('Stopping server...');
      try {
        this.isShutdownCalled = true;

        try {
          await this.stop();
        } catch (e) {
          error(e);
        }
        try {
          await this.shutdown();
        } catch (e) {
          error(e);
        }

        process.kill(process.pid, signal);
        process.exitCode = 0;
        if (stopProcess) {
          setTimeout(() => process.exit(0), 5000);
        }
      } catch (e) {
        // error(e);
        process.exit(1);
      }
    }
  }

}
