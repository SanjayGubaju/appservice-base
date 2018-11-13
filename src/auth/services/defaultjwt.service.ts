import { debug, error } from 'console';

import { SignOptions, decode, sign, verify } from 'jsonwebtoken';

import { Token } from '../models/token';
import { JwtService, json } from './jwt.service';
import { SignCertService } from './signcert.service';

export class DefaultJwtService implements JwtService {

  constructor(private privateSignCert: string,
              private publicSignCert: string,
              private signcertService?: SignCertService) {
    if (!privateSignCert || ! publicSignCert) {
      throw new Error('RSA keys are mandatory for JWT service');
    }
  }

  /*
  interface SignOptions {

    // (kid) Name of the signing key. Not relevant here as only one key is used
    keyid?: string;
    expiresIn?: string | number; // (exp) Value as seconds or a time string like "2 days",
  "10h", "7d" ( see https://github.com/zeit/ms.js)
    // https://stackoverflow.com/questions/43291659/usage-of-nbf-in-json-web-tokens
    notBefore?: string | number; // (nbf) Value as seconds or a time string like "2 days", "10h", "7d"
  ( see https://github.com/zeit/ms.js)
    audience?: string | string[]; // (aud) list of resource servers this token is allowed for
    subject?: string; // (sub) can be the user id
    issuer?: string; // (iss) e.g. SSO server that has approved users credentials
    jwtid?: string; // (jti) unique id can be used e.g. to revoke token using a whitelist or blacklist
    noTimestamp?: boolean; // do not set iat (JWT creation date) property
    header?: object; // jwt header
    encoding?: string;
  }
  */

  /**
   *
   *
   * @static
   * @type {SignOptions}
   * @memberof JwtService
   */
  public static readonly DEFAULT_OPTIONS: SignOptions = {
    expiresIn: '30d', // 30d
    algorithm: 'RS256', // RS256 is recommended when using RSA, RS384 or RS512 optional
    encoding: 'utf8',
  };

  // 10 sec should be subtracted from token expiration time du to request delay when contacting the
  // authorization server;
  private static readonly ASSUMED_MAX_REQUEST_TIME = 10;

  public async createToken(userid?: string,
                           payload: json = {},
                           options?: SignOptions,
                           asJson: boolean = true,
                           kid?: string): Promise<string | object> {
    const signCert: string | null = await this.getSignCert(true, kid);
    const opts: SignOptions = options || { ...DefaultJwtService.DEFAULT_OPTIONS };

    if (userid && !opts.subject) {
      opts.subject = userid;
    }
    return new Promise<string | object>((resolve, reject) => {
      sign(payload, signCert, opts, (err, token) => {
        if (err) {
          error(err);
          reject(err);
        } else {
          resolve(asJson ? { access_token: token } : token);
        }
      });
    });
  }

  private async getSignCert(isprivate: boolean,
                            kid?: string | undefined): Promise<string> {
    if (this.signcertService && kid) {
      return isprivate ? this.signcertService.getPrivateCert(kid) : this.signcertService.getPublicCert(kid);
    }
    return (isprivate ? this.privateSignCert : this.publicSignCert) || '';
  }

  public async decodeTokenFromRequest(headers: any, body: any, query: any, verify: boolean = true): Promise<Token> {
    const token: string = await this.getTokenFromRequest(headers, body, query);
    if (!token) {
      throw ('Invalid JWT');
    }
    return this.decodeToken(token);
  }

  public async decodeToken(inputtoken: string, verify: boolean = true): Promise<Token> {
    if (!inputtoken) {
      throw ('Invalid JWT');
    }
    const decoded: any = decode(inputtoken, { complete: true });
    if (!decoded) {
      debug('JWT is not valid');
    }
    const token: Token = new Token({
      accesstoken: inputtoken,
      kid: decoded.header.kid,
      expires: decoded.payload.exp,
      payload: decoded.payload,
      header: decoded.header,
    });
    if (verify) {
      this.verifyToken(token);
    }
    return token;
  }

  public async verifyToken(token: Token): Promise<boolean> {
    // Check expiration date.
    if (this.isExpired(token)) {
      throw ('Token expired');
    }

    const signCert: string = await this.getSignCert(false, token.getKid());
    if (!signCert) {
      error('Can not verify JWT, sign certificate is missing');
      throw ('JWT malformed or verification not possible');
    }

    return new Promise<boolean>((resolve, reject) => {
      verify(token.getAccessToken(), signCert, (err, token) => {
        if (err) {
          error(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  private isExpired(token: Token): boolean {
    return !token || token.getExpiration() - DefaultJwtService.ASSUMED_MAX_REQUEST_TIME < Date.now() / 1000;
  }

  private async getTokenFromRequest(headers: any, body: any, query: any): Promise<string> {
    const authorization: string = headers && headers['authorization'] ? headers['authorization'] || '' : '';
    if (authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }
    if (query && query['access_token']) {
      return query.access_token;
    }
    if (body && body['access_token']) {
      return body.access_token;
    }
    return '';
  }

}
