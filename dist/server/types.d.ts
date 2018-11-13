/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from 'http';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
export declare type FastifyServer = FastifyInstance<Server, IncomingMessage, ServerResponse>;
export declare type FastifyReq = FastifyRequest<IncomingMessage, any, any, any, any>;
export declare type FastifyResp = FastifyReply<ServerResponse>;
export declare type Middleware = (request: any, response: any, callback: (error?: Error) => void) => void;
export declare type ExpressMiddleware = RequestHandler | ErrorRequestHandler;
export declare type FastifyMiddleware = (request: IncomingMessage, response: ServerResponse, done: (error?: Error) => void) => void;
export declare type NextFunc = (err?: Error) => void;
