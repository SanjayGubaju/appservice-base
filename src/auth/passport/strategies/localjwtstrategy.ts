import { debug } from 'console';

import { Request } from 'express';

import { AuthUser } from '../../models/authuser';
import { Token } from '../../models/token';
import { AbstractJwtStrategy } from '../abstractjwtstrategy';
import { AuthenticationResult } from '../authenticationresult';

export class LocalJwtStrategy extends AbstractJwtStrategy {

  public static readonly STRATEGYNAME: string = 'localauth';

  protected getStrategyName(): string {
    return LocalJwtStrategy.STRATEGYNAME;
  }

  protected async authenticateJwtRequest(token: Token,
                                         request: Request,
                                         options?: any): Promise<AuthenticationResult> {
    const userid = token.getUserId();
    const user: AuthUser = await AuthUser.findByUUID(userid);
    debug('authenticateJwtRequest: user for id %s is %o', userid, user);
    if (!user) {
      throw new Error('Invalid user token');
    }
    return { user, token };
  }

}
