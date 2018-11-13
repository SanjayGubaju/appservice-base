"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../models/token");
class DefaultJwtService {
    constructor(privateSignCert, publicSignCert, signcertService) {
        this.privateSignCert = privateSignCert;
        this.publicSignCert = publicSignCert;
        this.signcertService = signcertService;
        if (!privateSignCert || !publicSignCert) {
            throw new Error('RSA keys are mandatory for JWT service');
        }
    }
    async createToken(userid, payload = {}, options, asJson = true, kid) {
        const signCert = await this.getSignCert(true, kid);
        const opts = options || Object.assign({}, DefaultJwtService.DEFAULT_OPTIONS);
        if (userid && !opts.subject) {
            opts.subject = userid;
        }
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.sign(payload, signCert, opts, (err, token) => {
                if (err) {
                    console_1.error(err);
                    reject(err);
                }
                else {
                    resolve(asJson ? { access_token: token } : token);
                }
            });
        });
    }
    async getSignCert(isprivate, kid) {
        if (this.signcertService && kid) {
            return isprivate ? this.signcertService.getPrivateCert(kid) : this.signcertService.getPublicCert(kid);
        }
        return (isprivate ? this.privateSignCert : this.publicSignCert) || '';
    }
    async decodeTokenFromRequest(headers, body, query, verify = true) {
        const token = await this.getTokenFromRequest(headers, body, query);
        if (!token) {
            throw ('Invalid JWT');
        }
        return this.decodeToken(token);
    }
    async decodeToken(inputtoken, verify = true) {
        if (!inputtoken) {
            throw ('Invalid JWT');
        }
        const decoded = jsonwebtoken_1.decode(inputtoken, { complete: true });
        if (!decoded) {
            console_1.debug('JWT is not valid');
        }
        const token = new token_1.Token({
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
    async verifyToken(token) {
        // Check expiration date.
        if (this.isExpired(token)) {
            throw ('Token expired');
        }
        const signCert = await this.getSignCert(false, token.getKid());
        if (!signCert) {
            console_1.error('Can not verify JWT, sign certificate is missing');
            throw ('JWT malformed or verification not possible');
        }
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.verify(token.getAccessToken(), signCert, (err, token) => {
                if (err) {
                    console_1.error(err);
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    isExpired(token) {
        return !token || token.getExpiration() - DefaultJwtService.ASSUMED_MAX_REQUEST_TIME < Date.now() / 1000;
    }
    async getTokenFromRequest(headers, body, query) {
        const authorization = headers && headers['authorization'] ? headers['authorization'] || '' : '';
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
DefaultJwtService.DEFAULT_OPTIONS = {
    expiresIn: '30d',
    algorithm: 'RS256',
    encoding: 'utf8',
};
// 10 sec should be subtracted from token expiration time du to request delay when contacting the
// authorization server;
DefaultJwtService.ASSUMED_MAX_REQUEST_TIME = 10;
exports.DefaultJwtService = DefaultJwtService;
