"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const winstonlogger_1 = require("../../logger/winstonlogger");
const class_decorator_1 = require("./class.decorator");
const requesthandler_1 = require("./requesthandler");
const validationresolver_1 = require("./validation/validationresolver");
class MethodDecorator {
    constructor() { }
    static getDecoratorFunc(route, httpMethod, options) {
        return (controllerClass, methodName, descriptor) => {
            MethodDecorator.addRoute(route, httpMethod, controllerClass, methodName, descriptor, options);
        };
    }
    static addRoute(route, httpMethod, controllerClass, methodName, descriptor, options = {}) {
        const validators = validationresolver_1.AjvValidationResolver.getValidationFunction(controllerClass, methodName, options.validation);
        const routeFunc = MethodDecorator.createRoutingFunc(controllerClass, methodName, descriptor, options, route);
        // tslint:disable-next-line:max-line-length
        const fastifyRouteFunc = MethodDecorator.createFastifyRoutingFunc(controllerClass, methodName, descriptor, options, route);
        class_decorator_1.ClassDecorator.addRouteMethod({
            route,
            validators,
            routeFunc,
            fastifyRouteFunc,
            method: httpMethod,
        }, controllerClass);
    }
    static createRoutingFunc(controllerClass, methodName, descriptor, options = {}, route) {
        const originalMethod = descriptor.value;
        return async (request, response) => {
            if (winstonlogger_1.WinstonLogger.isDebug()) {
                console_1.debug('Using route %s for request url %s', route, request.url);
            }
            const requestHandler = new requesthandler_1.RequestHandler(controllerClass, methodName, request, response, originalMethod, options.success, options.error, options.type || '', options.validation === null
                || options === undefined);
            requestHandler.executeRequest();
        };
    }
    static createFastifyRoutingFunc(controllerClass, methodName, descriptor, options = {}, route) {
        const originalMethod = descriptor.value;
        return async (request, response) => {
            if (winstonlogger_1.WinstonLogger.isDebug()) {
                console_1.debug('Using route %s for request url %s', route, request.req.url);
            }
            const expRequest = request.expressRequest;
            const expResponse = response.expressResponse;
            const requestHandler = new requesthandler_1.RequestHandler(controllerClass, methodName, expRequest, expResponse, originalMethod, options.success, options.error, options.type || '', options.validation === null
                || options === undefined);
            requestHandler.executeRequest();
        };
    }
}
exports.MethodDecorator = MethodDecorator;
