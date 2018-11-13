import { SignOptions } from 'jsonwebtoken';
import { Token } from '../models/token';
import { JwtService, json } from './jwt.service';
import { SignCertService } from './signcert.service';
export declare class DefaultJwtService implements JwtService {
    private privateSignCert;
    private publicSignCert;
    private signcertService?;
    constructor(privateSignCert: string, publicSignCert: string, signcertService?: SignCertService | undefined);
    /**
     *
     *
     * @static
     * @type {SignOptions}
     * @memberof JwtService
     */
    static readonly DEFAULT_OPTIONS: SignOptions;
    private static readonly ASSUMED_MAX_REQUEST_TIME;
    createToken(userid?: string, payload?: json, options?: SignOptions, asJson?: boolean, kid?: string): Promise<string | object>;
    private getSignCert;
    decodeTokenFromRequest(headers: any, body: any, query: any, verify?: boolean): Promise<Token>;
    decodeToken(inputtoken: string, verify?: boolean): Promise<Token>;
    verifyToken(token: Token): Promise<boolean>;
    private isExpired;
    private getTokenFromRequest;
}
