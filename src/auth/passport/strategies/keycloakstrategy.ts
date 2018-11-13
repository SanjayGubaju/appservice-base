// import { Request } from 'express';
// import { SimpleAuthService } from 'keycloak-oauth2-module';
// import { AuthUser } from 'keycloak-oauth2-module/dist/authuser';

// import { AbstractStrategy, AuthenticationResult } from '../../lib/auth/passport/abstractstrategy';

// export class KeycloakStrategy extends AbstractStrategy {

//   public static readonly STRATEGYNAME: string = 'keycloak';

//   constructor(private simpleauthservice: SimpleAuthService, excludePaths?: string[] | RegExp[]) {
//     super(excludePaths);
//   }

//   protected getStrategyName(): string {
//     return KeycloakStrategy.STRATEGYNAME;
//   }

//   protected async authenticateRequest(request: Request, options?: any): Promise<AuthenticationResult> {
//     const authuser: AuthUser = await this.simpleauthservice.auth.authenticateRequest(request.headers,
//                                                                                      request.query,
//                                                                                      request.body);
//     return { user: authuser.user, token: authuser.token };
//   }

// }
