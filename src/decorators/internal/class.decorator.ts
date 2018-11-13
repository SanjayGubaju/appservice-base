import { info } from 'console';
import { IncomingMessage, ServerResponse } from 'http';

import { Request, Response, Router } from 'express';
import { RequestHandler as FastifyRequestHandler, HTTPMethod } from 'fastify';

import { Configuration } from '../../config/config';
import { Environment } from '../../config/environment';
import { FastifyReq, FastifyResp, FastifyServer, NextFunc } from '../../server/types';
import { StringUtil } from '../../util/stringutil';

import express = require('express');

export interface RouteMethod {
  method: string;
  route: string;
  validators: (request: any, response: any, done: NextFunc) => void;
  routeFunc: (request: Request, response: Response) => {};
  fastifyRouteFunc: FastifyRequestHandler<IncomingMessage, ServerResponse>;
  targetHash?: number;
}

export class ClassDecorator {

  public static readonly CLASSMETADATA = 'classmetadata';
  public static readonly CLASSINSTANCE = 'classinstance';
  public static readonly URLS_ENDPOINT = '_urls';

  private static readonly htmlStart = '<!DOCTYPE html><html><head><meta charset="utf-8"> \
                                        <title>Urls</title></head><body>';
  private static readonly htmlEnd = '</body></html>';

  private static targets = new Map<number, any>();
  private static routeMethods: RouteMethod[] = [];
  private static urls: string = '';

  private constructor() { }

  public static getDecoratorFunc(route: string) {
    return (target: any) => {
      const targetObj = ClassDecorator.targets.get(StringUtil.hashCode(target.toString()));
      if (targetObj) {
        targetObj[ClassDecorator.CLASSMETADATA]['route'] = route;
      }
    };
  }

  public static setHash(target: any): void {
    ClassDecorator.ensureMetadata(target);
    if (!target[ClassDecorator.CLASSMETADATA]['hash']) {
      target[ClassDecorator.CLASSMETADATA]['hash'] = ClassDecorator.hash(target);
    }
  }

  public static getHash(target: any): number {
    ClassDecorator.setHash(target);
    return target[ClassDecorator.CLASSMETADATA]['hash'];
  }

  public static addController(controller: any): void {
    const controllerHash: number = ClassDecorator.hash(controller);
    const target = ClassDecorator.targets.get(controllerHash);
    if (target) {
      target[ClassDecorator.CLASSMETADATA][ClassDecorator.CLASSINSTANCE] = controller;
    }
  }

  public static getController(target: any): any {
    ClassDecorator.ensureMetadata(target);
    return target[ClassDecorator.CLASSMETADATA][ClassDecorator.CLASSINSTANCE];
  }

  public static addRouteMethod(routeMethod: RouteMethod, target: any): void {
    ClassDecorator.setHash(target);
    const targetHash = ClassDecorator.getHash(target);
    if (!ClassDecorator.targets.has(targetHash)) {
      ClassDecorator.targets.set(targetHash, target);
    }
    ClassDecorator.routeMethods.push({ ...routeMethod, targetHash });
  }

  public static setRoutesExpress(expressServer: express.Express): void {
    const router: Router = Router();
    ClassDecorator.createUrlListPage(router);
    for (const routeMethod of ClassDecorator.routeMethods) {
      ClassDecorator.addRouteExpress(routeMethod, router);
    }
    ClassDecorator.routeMethods = [];
    expressServer.use('/', router);
  }

  public static setRoutesFastify(fastifyServer: FastifyServer): void {
    ClassDecorator.createUrlListPage(fastifyServer);
    ClassDecorator.addRoutesFastify(fastifyServer);
  }

  private static hash(target: any): number {
    return StringUtil.hashCode(target.constructor.toString());
  }

  private static ensureMetadata(target: any): void {
    if (!target[ClassDecorator.CLASSMETADATA]) {
      target[ClassDecorator.CLASSMETADATA] = { hash: ClassDecorator.hash(target) };
    }
  }

  private static addRouteExpress(routeMethod: RouteMethod, router: Router): void {
    const target = ClassDecorator.targets.get(routeMethod.targetHash || 0);
    const baseRoute = target[ClassDecorator.CLASSMETADATA]['route'] || '';
    const useRoute = routeMethod.route === '/' && baseRoute ? '' : '/'.concat(routeMethod.route.replace(/^\//, ''));
    info('Add route to %s with method %s', baseRoute.concat(useRoute), routeMethod.method);
    switch (routeMethod.method) {
      case 'get':
        router.get(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'post':
        router.post(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'put':
        router.put(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'delete':
        router.delete(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'head':
        router.head(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'trace':
        router.trace(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'options':
        router.options(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'connect':
        router.connect(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      case 'patch':
        router.patch(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
        break;
      default:
        router.get(baseRoute.concat(useRoute), routeMethod.validators, routeMethod.routeFunc);
    }
  }

  private static addRoutesFastify(fastifyServer: FastifyServer): void {
    for (const routeMethod of ClassDecorator.routeMethods) {
      const target = ClassDecorator.targets.get(routeMethod.targetHash || 0);
      const baseRoute = target[ClassDecorator.CLASSMETADATA]['route'] || '';
      const useRoute = routeMethod.route === '/' && baseRoute ? '' : '/'.concat(routeMethod.route.replace(/^\//, ''));
      info('Add route to %s with method %s', baseRoute.concat(useRoute), routeMethod.method);
      fastifyServer.route({
        method: <HTTPMethod>routeMethod.method.toUpperCase(),
        url: baseRoute.concat(useRoute),
        handler: routeMethod.fastifyRouteFunc,
        beforeHandler: routeMethod.validators,
      });
    }
  }

  private static createUrlListPage(router: Router | FastifyServer): void {
    if (Configuration.getEnvironment() === Environment.Production) {
      return;
    }
    info('Add route to /_urls with method GET');
    for (const routeMethod of ClassDecorator.routeMethods) {
      ClassDecorator.addUrl(routeMethod);
    }
    ClassDecorator.urls = `${ClassDecorator.htmlStart}${ClassDecorator.urls}${ClassDecorator.htmlEnd}`;

    if (router instanceof Router) {
      (<Router>router).get('/_urls', (req: Request, resp: Response) => {
        resp.status(200).type('text/html; charset=utf-8').send(ClassDecorator.urls);
      });
    } else {
      (<FastifyServer>router).get('/_urls', (req: FastifyReq, resp: FastifyResp) => {
        resp.status(200).type('text/html; charset=utf-8').send(ClassDecorator.urls);
      });
    }

  }

  private static addUrl(routeMethod: RouteMethod): void {
    const target = ClassDecorator.targets.get(routeMethod.targetHash || 0);
    const baseRoute = target[ClassDecorator.CLASSMETADATA]['route'] || '';
    const useRoute = routeMethod.route === '/' && baseRoute ? '' : '/'.concat(routeMethod.route.replace(/^\//, ''));
    const link = baseRoute.concat(useRoute);
    ClassDecorator.urls += `<p>
        <span style="display:inline-block;width:70px;">${routeMethod.method.toUpperCase()}</span>
        <a href="${link}">${link}</a>
    </p>`;
  }

}
