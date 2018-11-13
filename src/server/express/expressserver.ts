import { debug, info } from 'console';
import * as http from 'http';
import { resolve } from 'path';

import * as compression from 'compression';
import * as cors from 'cors';
// tslint:disable-next-line:no-duplicate-imports
import { CorsOptions } from 'cors';
import * as errorhandler from 'errorhandler';
import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports
import { Express, Request, Response } from 'express';
import * as multer from 'multer';

import { PassportStrategy } from '../../auth/passport/passportstrategy';
import { Configuration } from '../../config/config';
import { Environment } from '../../config/environment';
import { ClassDecorator } from '../../decorators/internal/class.decorator';
import { AbstractServer } from '../abstractserver';
import { Endpoint } from '../endpoint';
import { NextFunc } from '../types';

http.globalAgent.maxSockets = Infinity;

export class ExpressServer extends AbstractServer {

  protected express: Express;
  protected httpServer!: http.Server;

  constructor(private port: number = AbstractServer.DEFAULT_PORT,
              private env: string = Environment.Development,
              corsServerUri: string | string[] = '*') {
    super(express(), corsServerUri);
    this.express = <Express>this.baseServer;
    this.express.set('env', this.env);
    this.express.set('x-powered-by', false);
    this.express.set('case sensitive routing', false);

    if (Configuration.getBoolean('BEHIND_PROXY')) {
      this.express.set('trust proxy', Configuration.get('TRUST_PROXY_SETTING') || true);
    }
  }

  public startServer(): void {
    if (this.env === Environment.Development) {
      this.express.use(errorhandler());
    }
    super.startServer();
  }

  protected start(): void {
    debug(this.express._router.stack);

    this.httpServer = this.express.listen(this.port, () => {
      info('App is running at http://localhost:%d in %s mode', this.port, this.env);
      info('Press CTRL-C to stop\n');
    });
  }

  protected beforeStart(): void { }
  protected async shutdown(): Promise<void> { }

  protected initDefaultHeaders(): void {
    const { headers, staticHeaders } = this.prepareDefaultHeaders();
    this.express.use((request: Request,
                      response: Response,
                      done: NextFunc) => {
      const applyHeaders = this.isStaticHeaders(request) ? staticHeaders : headers;
      let length = applyHeaders.length;
      // tslint:disable-next-line:no-increment-decrement
      while (length--) {
        const keyvalue = applyHeaders[length];
        response.setHeader(keyvalue[0], keyvalue[1]);
      }
      done();
    });
  }

  private isStaticHeaders(request: Request): boolean {
    const extension: any = request.url.match(/\.([^\/]+)$/);
    const notStaticExtensions = ['json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'js', 'css', 'woff', 'woff2'];
    return !extension || notStaticExtensions.includes(extension[1].toLowerCase());
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
    this.express.use(cors(options));
    this.express.options('*', cors(options));
  }

  protected initCompression(): void {
    if (Configuration.getBoolean('USE_COMPRESSION')) {
      this.express.use(compression());
    }
  }

  protected initBodyParser(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(multer({ dest: './uploads/' }).any());
  }

  protected initPassportStrategies(passportStrategies: { path: string; strategy: PassportStrategy; }[]): void {
    for (const strategy of passportStrategies) {
      strategy.strategy.addToExpress(this.express, strategy.path);
    }
  }

  protected initRoutes(): void {
    ClassDecorator.setRoutesExpress(this.express);
  }

  protected initStaticEndpoints(staticEndpoints: Endpoint[]): void {
    for (const staticEndpoint of staticEndpoints) {
      this.express.use(staticEndpoint.path,
                       express.static(resolve(staticEndpoint.dir), {
                         setHeaders: this.getSetHeadersFunc(staticEndpoint),
                         index: staticEndpoint.index || 'index.html',
                       }));
    }
  }

  protected async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.httpServer.close(() => {
        resolve();
      });
    });
  }

}
