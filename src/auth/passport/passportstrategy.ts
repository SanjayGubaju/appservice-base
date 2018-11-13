import { Express } from 'express';
import * as passport from 'passport';

import { ExpressMiddleware } from '../../server/types';

export interface PassportStrategy extends passport.Strategy {

  // Express
  addToExpress(express: Express, path?: string): void;

  // Fastify
  getMiddleware(): ExpressMiddleware | null;

}
