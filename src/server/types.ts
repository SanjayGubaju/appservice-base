import { IncomingMessage, Server, ServerResponse } from 'http';

import { ErrorRequestHandler, RequestHandler } from 'express';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type FastifyServer = FastifyInstance<Server, IncomingMessage, ServerResponse>;
export type FastifyReq = FastifyRequest<IncomingMessage, any, any, any, any>;
export type FastifyResp = FastifyReply<ServerResponse>;
export type Middleware = (request: any, response: any, callback: (error?: Error) => void) => void;
export type ExpressMiddleware = RequestHandler | ErrorRequestHandler;
// tslint:disable-next-line:max-line-length
export type FastifyMiddleware = (request: IncomingMessage, response: ServerResponse, done: (error?: Error) => void) => void;

export type NextFunc = (err?: Error) => void;

type DefaultHeaders = { headers: string[][]; staticHeaders: string[][]; };
