import { Request } from 'express';
import { Token } from '../models/token';
import { JwtService } from '../services/jwt.service';
import { AbstractStrategy } from './abstractstrategy';
import { AuthenticationResult } from './authenticationresult';
export declare abstract class AbstractJwtStrategy extends AbstractStrategy {
    private jwtService;
    constructor(jwtService: JwtService, whitelist?: string[] | RegExp[]);
    protected authenticateRequest(request: Request, options?: any): Promise<AuthenticationResult>;
    protected abstract authenticateJwtRequest(token: Token, request: Request, options?: any): Promise<AuthenticationResult>;
}
