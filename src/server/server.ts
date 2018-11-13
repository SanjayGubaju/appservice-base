import { Middleware } from './types';
import { IHelmetContentSecurityPolicyDirectives } from 'helmet';
import { PassportStrategy } from '../auth/passport/passportstrategy';

export interface Server {

  startServer(): void;
  addMiddleware(path: any, handler: Middleware): void;
  addStaticFiles(directory: string,
                 endpoint?: string,
                 index?: string,
                 allowInsecureContent?: boolean,
                 directives?: IHelmetContentSecurityPolicyDirectives): void;
  addController(controller: any): void;
  addPassportStrategy(path: string, strategy: PassportStrategy): void;
  disableContentSecurityPolicy(): void;
}
