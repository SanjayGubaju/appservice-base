import { Express, Request } from 'express';
import { Strategy } from 'passport-strategy';
import { ExpressMiddleware } from '../../server/types';
import { AuthenticationResult } from './authenticationresult';
import { PassportStrategy } from './passportstrategy';
export declare abstract class AbstractStrategy extends Strategy implements PassportStrategy {
    protected abstract getStrategyName(): string;
    protected abstract authenticateRequest(request: Request, options?: any): Promise<AuthenticationResult>;
    private readonly excludedPathsString?;
    private readonly whitelist?;
    protected readonly errorMsg: string;
    /**
     * Creates an instance of AbstractJwtStrategy.
     * @param {(string[] | RegExp[])} [whitelist] List of regular expressions matching those paths
     * that should not checked for authentication, e.g. /login
     * @memberof AbstractJwtStrategy
     */
    constructor(whitelist?: string[] | RegExp[] | string, loginPath?: string, registrationPath?: string);
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
    addToExpress(express: Express, path?: string): void;
    getMiddleware(): ExpressMiddleware | null;
    private getAuthFunc;
    authenticate(request: Request, options?: any): Promise<any>;
    private isExcluded;
    private getResponseType;
}
