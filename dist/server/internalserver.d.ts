import { Middleware } from './types';
export interface InternalServer {
    use: (pathOrMiddleware: Middleware | string, middleware?: Middleware) => void;
}
