import { Request } from 'express';
import { Token } from '../../models/token';
import { AbstractJwtStrategy } from '../abstractjwtstrategy';
import { AuthenticationResult } from '../authenticationresult';
export declare class LocalJwtStrategy extends AbstractJwtStrategy {
    static readonly STRATEGYNAME: string;
    protected getStrategyName(): string;
    protected authenticateJwtRequest(token: Token, request: Request, options?: any): Promise<AuthenticationResult>;
}
