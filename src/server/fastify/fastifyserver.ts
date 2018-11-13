import { error, info } from 'console';
import * as http from 'http';
// tslint:disable-next-line:no-duplicate-imports
import { IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';

import { CorsOptions } from 'cors';
import { Application, ErrorRequestHandler, RequestHandler } from 'express';
import * as fastify from 'fastify';
import * as cors from 'fastify-cors';

import { PassportStrategy } from '../../auth/passport/passportstrategy';
import { Configuration } from '../../config/config';
import { Environment } from '../../config/environment';
import { ClassDecorator } from '../../decorators/internal/class.decorator';
import { AbstractServer } from '../abstractserver';
import { Endpoint } from '../endpoint';
import { ExpressMiddleware, FastifyReq, FastifyResp, FastifyServer as FastifyServerApp, NextFunc } from '../types';
import { SimpleApplicationCompat } from './fastifycompat/simple/simpleapplicationcompat';
import { SimpleRequestCompat } from './fastifycompat/simple/simplerequestcompat';
import { SimpleResponseCompat } from './fastifycompat/simple/simpleresponsecompat';
import { ApplicationCompat } from './fastifycompat/extended/applicationcompat';
import { RequestCompat } from './fastifycompat/extended/requestcompat';
import { ResponseCompat } from './fastifycompat/extended/responsecompat';

http.globalAgent.maxSockets = Infinity;

export class FastifyServer extends AbstractServer {

  protected fastifyServer: FastifyServerApp;
  protected app: Application;
  private middlewarescompat: Map<string, { middleware: ExpressMiddleware; iserrhandler: boolean; }[]>;

  constructor(private port: number = AbstractServer.DEFAULT_PORT,
              private env: string = Environment.Development,
              corsServerUri: string | string[] = '*') {
    super((<any>fastify)({
      https: false,
      http2: false,
      logger: false, // disable internal pino logger as we're using morgan/winston logger
      caseSensitive: false,
      trustProxy: Configuration.getBoolean('BEHIND_PROXY') ? Configuration.get('TRUST_PROXY_SETTING') || true : null,
    }),   corsServerUri);

    this.fastifyServer = <FastifyServerApp>this.baseServer;
    this.middlewarescompat = new Map<string, { middleware: ExpressMiddleware; iserrhandler: boolean; }[]>();
    this.app = this.getCompatApplicationLayer(this.fastifyServer);
    this.app.set('env', this.env);
  }

  public addMiddlewareCompat(pathOrHandler: string | ExpressMiddleware, handler?: ExpressMiddleware | null): void {
    const path: string = typeof pathOrHandler === 'string' ? pathOrHandler : '';
    const reqHandler = typeof pathOrHandler === 'string' ? handler : pathOrHandler;
    if (reqHandler != null) {
      if (!this.middlewarescompat.has(path)) {
        this.middlewarescompat.set(path, []);
      }
      this.middlewarescompat.get(path)!.push({
        middleware: reqHandler,
        iserrhandler: reqHandler['prototype'] && reqHandler.prototype.constructor.length === 4,
      });
    }
  }

  protected start(): void {
    this.initCompatMiddlewares();

    this.fastifyServer.listen(this.port, Configuration.get('SERVER_ADDRESS'))
      .then((address) => {
        info('App is running at %s in %s mode', address, this.env);
        info('Press CTRL-C to stop\n');
      })
      .catch((err) => {
        info('Error starting server:', err);
        error(err);
        process.exit(1);
      });
  }

  protected beforeStart(): void { }
  protected async shutdown(): Promise<void> { }

  protected initDefaultHeaders(): void {
    const { headers, staticHeaders } = this.prepareDefaultHeaders();
    this.fastifyServer.addHook('onSend', (request: FastifyReq,
                                          response: FastifyResp,
                                          payload: any,
                                          done: NextFunc) => {
      const applyHeaders = (<any>response).getHeader('content-type').startsWith('text/html')
        ? staticHeaders
        : headers;
      let length = applyHeaders.length;
      // tslint:disable-next-line:no-increment-decrement
      while (length--) {
        const keyvalue = applyHeaders[length];
        if (!(<any>response).getHeader(keyvalue[0])) {
          response.header(keyvalue[0], keyvalue[1]);
        }
      }
      done();
    });
  }

  /**
   * Adds and configures the following middleware:
   *
   * * cors
   *
   * @protected
   * @memberof AbstractExpressServer
   */
  protected initCors(options: CorsOptions): void {
    this.fastifyServer.register(cors, options);
    // this.fastifyServer.options('*', (request, reply) => { reply.send(); });
  }

  protected initCompression(): void {
    if (Configuration.getBoolean('USE_COMPRESSION')) {
      this.fastifyServer.register(require('fastify-compress'));
    }
  }

  protected initBodyParser(): void {
    this.fastifyServer.register(require('fastify-formbody'));

    if (Configuration.getBoolean('ALLOW_FILE_UPLOAD')) {
      this.fastifyServer.register(require('fastify-file-upload'), {
        limits: { fileSize: 50 * 1024 * 1024 },
        safeFileNames: true,
        preserveExtension: true,
        abortOnLimit: true,
      });
    }
  }

  protected initPassportStrategies(passportStrategies: { path: string; strategy: PassportStrategy; }[]): void {
    for (const strategy of passportStrategies) {
      this.addMiddlewareCompat(strategy.path, strategy.strategy.getMiddleware());
    }
  }

  protected initRoutes(): void {
    ClassDecorator.setRoutesFastify(this.fastifyServer);
  }

  protected async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fastifyServer.close(() => {
        resolve();
      });
    });
  }

  protected initStaticEndpoints(staticEndpoints: Endpoint[]): void {
    for (const staticEndpoint of staticEndpoints) {
      this.fastifyServer.register(require('fastify-static'), {
        setHeaders: this.getSetHeadersFunc(staticEndpoint),
        root: resolve(staticEndpoint.dir),
        prefix: staticEndpoint.path,
        index: `/${staticEndpoint.index || 'index.html'}`,
      });
    }
  }

  protected initCompatMiddlewares(): void {
    for (const [path, middlewares] of this.middlewarescompat.entries()) {
      const handler = (request: IncomingMessage, response: ServerResponse, done: (err?: Error) => void) => {
        Reflect.set(request, 'compatmiddleware', [...middlewares]);
        done();
      };
      if (path) {
        this.fastifyServer.use(path, handler);
      } else {
        this.fastifyServer.use(handler);
      }
    }

    this.fastifyServer.addHook('preHandler', (request: FastifyReq,
                                              response: FastifyResp,
                                              next: (err?: any) => void) => {
      const req = this.getCompatRequestLayer(request, this.app);
      const resp = this.getCompatResponseLayer(response, this.app);
      req.setResponse(resp);
      resp.setRequest(req);

      (<any>request).expressRequest = req;
      (<any>response).expressResponse = resp;

      const compatmiddlewares: { middleware: ExpressMiddleware; iserrhandler: boolean; }[]
      = Reflect.get(request.req, 'compatmiddleware') || [];
      let count = 0;
      const nextFunc = async () => {
        if (compatmiddlewares.length > count) {
          count += 1;
          const compatmiddleware = compatmiddlewares[count - 1];
          if (compatmiddleware.iserrhandler) {
            (<ErrorRequestHandler>compatmiddleware.middleware)({}, req, resp, nextFunc);
          } else {
            (<RequestHandler>compatmiddleware.middleware)(req, resp, nextFunc);
          }
        } else {
          next();
        }
      };
      try {
        nextFunc();
      } catch (e) {
        error(e);
        response.status(400);
        next(`${e}`);
      }
    });
  }

  private getCompatApplicationLayer(fastifyServer: FastifyServerApp): any {
    switch (Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
      case 1: return ApplicationCompat.getProxyInstance(fastifyServer);
      case 2: return ApplicationCompat.getInstance(fastifyServer);
      case 3: return SimpleApplicationCompat.getProxyInstance(fastifyServer);
      default: return SimpleApplicationCompat.getInstance(fastifyServer);
    }
  }

  private getCompatRequestLayer(request: FastifyReq, app: Application): any {
    switch (Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
      case 1: return RequestCompat.getProxyInstance(request, app);
      case 2: return RequestCompat.getInstance(request, app);
      case 3: return SimpleRequestCompat.getProxyInstance(request, app);
      default: return SimpleRequestCompat.getInstance(request, app);
    }
  }

  private getCompatResponseLayer(response: FastifyResp, app: Application): any {
    switch (Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
      case 1: return ResponseCompat.getProxyInstance(response, app);
      case 2: return ResponseCompat.getInstance(response, app);
      case 3: return SimpleResponseCompat.getProxyInstance(response, app);
      default: return SimpleResponseCompat.getInstance(response, app);
    }
  }

}
