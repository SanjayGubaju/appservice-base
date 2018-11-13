import { Request } from 'express';

import { Token } from '../models/token';
import { JwtService } from '../services/jwt.service';
import { AbstractStrategy } from './abstractstrategy';
import { AuthenticationResult } from './authenticationresult';

export abstract class AbstractJwtStrategy extends AbstractStrategy {

  constructor(private jwtService: JwtService,
              whitelist?: string[] | RegExp[]) {
    super(whitelist);
  }

  protected async authenticateRequest(request: Request,
                                      options?: any): Promise<AuthenticationResult> {
    const token: Token = await this.jwtService.decodeTokenFromRequest(request.headers,
                                                                      request.body,
                                                                      request.query,
                                                                      true);
    return this.authenticateJwtRequest(token, request, options);
  }

  protected abstract async authenticateJwtRequest(token: Token,
                                                  request: Request,
                                                  options?: any): Promise<AuthenticationResult>;
}
