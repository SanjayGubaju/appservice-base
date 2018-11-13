import { PassportStrategy } from './auth/passport/passportstrategy';
export interface AuthenticationConfig {
    path?: string;
    excludes?: string[];
    auth?: {
        loginPath: string;
        registrationPath: string;
        controller: any;
    };
    strategy?: PassportStrategy;
}
