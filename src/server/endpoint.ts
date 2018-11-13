import { IHelmetContentSecurityPolicyDirectives } from 'helmet';

export interface Endpoint {
  path: string;
  dir: string;
  index?: string;
  directives?: IHelmetContentSecurityPolicyDirectives;
  insecureContent?: boolean;
}
