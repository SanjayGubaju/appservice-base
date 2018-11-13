import { debug } from 'console';

import { Express, Request, Response, RequestHandler } from 'express';
import * as passport from 'passport';
import { Strategy } from 'passport-strategy';

import { Configuration } from '../../config/config';
import { ExpressMiddleware, NextFunc } from '../../server/types';
import { AuthenticationResult } from './authenticationresult';
import { PassportStrategy } from './passportstrategy';

export abstract class AbstractStrategy extends Strategy implements PassportStrategy {

  protected abstract getStrategyName(): string;
  protected abstract async authenticateRequest(request: Request,
                                               options?: any): Promise<AuthenticationResult>;

  private readonly excludedPathsString?: string[];
  private readonly whitelist?: RegExp[];
  protected readonly errorMsg: string;

  /**
   * Creates an instance of AbstractJwtStrategy.
   * @param {(string[] | RegExp[])} [whitelist] List of regular expressions matching those paths
   * that should not checked for authentication, e.g. /login
   * @memberof AbstractJwtStrategy
   */
  constructor(whitelist?: string[] | RegExp[] | string, loginPath?: string, registrationPath?: string) {
    super();
    // TODO: use path-to-regexp?
    if (whitelist && whitelist.length) {
      if (typeof whitelist === 'string') {
        this.whitelist = [new RegExp(whitelist)];
      } else if (typeof whitelist[0] === 'string') {
        this.whitelist = (<string[]>whitelist).map<RegExp>(path => new RegExp(path));
      } else {
        this.whitelist = [...whitelist] as RegExp[];
      }
    }
    this.errorMsg = JSON.stringify({
      error: 'Unauthorized',
      login: loginPath || Configuration.get('LOGIN_ENDPOINT'),
      registration: registrationPath || Configuration.get('REGISTRATION_ENDPOINT'),
    });
  }

  /**
   * Adds this passport strategy to the express router.
   *
   * @example
   * ````
   * // Assumed AuthJwtStrategy extends {@link AbstractJwtStrategy}
   * const authService = new AuthJwtStrategy(jwtService, ['/register', '/login']);
   * authService.addToExpress(this.express);
   * ```
   * @param {Express} express
   * @param {string} path
   * @memberof AbstractJwtStrategy
   */
  public addToExpress(express: Express, path: string = '/'): void {
    if (Configuration.getBoolean('ENABLE_AUTHENTICATION')) {
      passport.use(this.getStrategyName(), this);
      express.use(path, passport.initialize());
      express.all(path, this.getAuthFunc(),

        );
    }
  }

  public getMiddleware(): ExpressMiddleware | null {
    if (Configuration.getBoolean('ENABLE_AUTHENTICATION')) {
      passport.use(this.getStrategyName(), this);
      return (request: Request, response: Response, next: (err?: any) => void) => {
        passport.initialize()(request, response, () => {});
        this.getAuthFunc()(request, response, next);
      };
    }
    return null;
  }

  private getAuthFunc(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunc) => {
      passport.authenticate(this.getStrategyName(),
                            { session: false },
                            (err, user, info) => {
                              if (err) {
                                return next(err);
                              }
                              if (!user) {
                                const respType = this.getResponseType(req.headers['accept']);
                                res.status(401).type(respType).send(this.errorMsg);
                              } else {
                                (<any>req)['user'] = user;
                                req.authInfo = info;
                                next();
                              }
                            })(req, res, next);
    };
  }

  public async authenticate(request: Request, options?: any): Promise<any> {
    if (this.isExcluded(request.path)) {
      this.pass();
    } else {
      try {
        const result: AuthenticationResult = await this.authenticateRequest(request, options);
        this.success(result.user, result);
      } catch (e) {
        debug(e);
        this.fail(401);
      }
    }
  }

  private isExcluded(path: string): boolean {
    if (this.whitelist && this.whitelist.length) {
      for (const valueRegExp of this.whitelist) {
        if (valueRegExp.test(path)) {
          return true;
        }
      }
    } else if (this.excludedPathsString && this.excludedPathsString.length) {
      for (const stringValue of this.excludedPathsString) {
        if (path === stringValue) {
          return true;
        }
      }
    }
    return false;
  }

  private getResponseType(acceptHeader: string = ''): string {
    const jsonType = 'application/json';
    if (acceptHeader && acceptHeader.indexOf(jsonType) >= 0
      || acceptHeader.indexOf('/*') >= 0
      || new RegExp(`[/+]${jsonType}[,;+]`).test(acceptHeader)) {
      return `${jsonType}; charset=utf-8`;
    }
    return 'text/plain; charset=utf-8';
  }

}
