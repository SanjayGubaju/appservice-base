import { Express } from 'express';
import * as passport from 'passport';
import { ExpressMiddleware } from '../../server/types';
export interface PassportStrategy extends passport.Strategy {
    addToExpress(express: Express, path?: string): void;
    getMiddleware(): ExpressMiddleware | null;
}
