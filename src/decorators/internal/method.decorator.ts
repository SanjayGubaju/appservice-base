import { debug } from 'console';
import { IncomingMessage, ServerResponse } from 'http';

import { RequestHandler as ExpressRequestHandler, Request, Response } from 'express';
import { FastifyReply, FastifyRequest, RequestHandler as FastifyRequestHandler } from 'fastify';

import { WinstonLogger } from '../../logger/winstonlogger';
import { ClassDecorator } from './class.decorator';
import { RequestHandler } from './requesthandler';
import { AjvValidationResolver } from './validation/validationresolver';

export interface RequestOptions {
  validation?: ExpressRequestHandler[];
  success?: number;
  error?: number;
  type?: string;
}

export class MethodDecorator {

  private constructor() { }

  public static getDecoratorFunc(route: string, httpMethod: string,
                                 options?: RequestOptions) {
    return (controllerClass: any, methodName: string, descriptor: PropertyDescriptor) => {
      MethodDecorator.addRoute(route, httpMethod, controllerClass, methodName, descriptor, options);
    };
  }

  private static addRoute(route: string,
                          httpMethod: string,
                          controllerClass: any,
                          methodName: string,
                          descriptor: PropertyDescriptor,
                          options: RequestOptions = {}): void {
    const validators = AjvValidationResolver.getValidationFunction(controllerClass, methodName, options.validation);

    const routeFunc = MethodDecorator.createRoutingFunc(controllerClass, methodName, descriptor, options, route);
    // tslint:disable-next-line:max-line-length
    const fastifyRouteFunc = MethodDecorator.createFastifyRoutingFunc(controllerClass, methodName, descriptor, options, route);
    ClassDecorator.addRouteMethod({
      route,
      validators,
      routeFunc,
      fastifyRouteFunc,
      method: httpMethod,
    },                            controllerClass);
  }

  private static createRoutingFunc(controllerClass: any,
                                   methodName: string,
                                   descriptor: PropertyDescriptor,
                                   options: RequestOptions = {},
                                   route: string): (request: Request, response: Response) => {} {
    const originalMethod: () => {} = descriptor.value;
    return async (request: Request, response: Response) => {
      if (WinstonLogger.isDebug()) {
        debug('Using route %s for request url %s', route, request.url);
      }
      const requestHandler = new RequestHandler(controllerClass,
                                                methodName,
                                                request,
                                                response,
                                                originalMethod,
                                                options.success,
                                                options.error,
                                                options.type || '',
                                                options.validation === null
        || options === undefined);
      requestHandler.executeRequest();
    };
  }

  private static createFastifyRoutingFunc(controllerClass: any,
                                          methodName: string,
                                          descriptor: PropertyDescriptor,
                                          options: RequestOptions = {},
                                          route: string): FastifyRequestHandler<IncomingMessage, ServerResponse> {
    const originalMethod: () => {} = descriptor.value;
    return async (request: FastifyRequest<IncomingMessage>, response: FastifyReply<ServerResponse>) => {
      if (WinstonLogger.isDebug()) {
        debug('Using route %s for request url %s', route, request.req.url);
      }

      const expRequest: Request = (<any>request).expressRequest;
      const expResponse: Response = (<any>response).expressResponse;

      const requestHandler = new RequestHandler(controllerClass,
                                                methodName,
                                                expRequest,
                                                expResponse,
                                                originalMethod,
                                                options.success,
                                                options.error,
                                                options.type || '',
                                                options.validation === null
        || options === undefined);
      requestHandler.executeRequest();
    };
  }

}
