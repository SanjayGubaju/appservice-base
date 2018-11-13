import { Token } from '../models/token';
import { SignOptions } from 'jsonwebtoken';

export type json = object;

export interface JwtService {
  verifyToken(token: Token) : Promise<boolean>;
  decodeToken(inputtoken: string, verify?: boolean): Promise<Token>;
  decodeTokenFromRequest(headers: any, body: any, query: any, verify?: boolean): Promise<Token>;
  createToken(userid?: string,
              payload?: json,
              options?: SignOptions,
              asJson?: boolean,
              kid?: string): Promise<string | object>;
}
