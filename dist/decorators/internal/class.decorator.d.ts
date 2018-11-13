/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';
import { RequestHandler as FastifyRequestHandler } from 'fastify';
import { FastifyServer, NextFunc } from '../../server/types';
import express = require('express');
export interface RouteMethod {
    method: string;
    route: string;
    validators: (request: any, response: any, done: NextFunc) => void;
    routeFunc: (request: Request, response: Response) => {};
    fastifyRouteFunc: FastifyRequestHandler<IncomingMessage, ServerResponse>;
    targetHash?: number;
}
export declare class ClassDecorator {
    static readonly CLASSMETADATA = "classmetadata";
    static readonly CLASSINSTANCE = "classinstance";
    static readonly URLS_ENDPOINT = "_urls";
    private static readonly htmlStart;
    private static readonly htmlEnd;
    private static targets;
    private static routeMethods;
    private static urls;
    private constructor();
    static getDecoratorFunc(route: string): (target: any) => void;
    static setHash(target: any): void;
    static getHash(target: any): number;
    static addController(controller: any): void;
    static getController(target: any): any;
    static addRouteMethod(routeMethod: RouteMethod, target: any): void;
    static setRoutesExpress(expressServer: express.Express): void;
    static setRoutesFastify(fastifyServer: FastifyServer): void;
    private static hash;
    private static ensureMetadata;
    private static addRouteExpress;
    private static addRoutesFastify;
    private static createUrlListPage;
    private static addUrl;
}
