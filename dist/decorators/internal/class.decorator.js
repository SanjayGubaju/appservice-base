"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = require("express");
const config_1 = require("../../config/config");
const environment_1 = require("../../config/environment");
const stringutil_1 = require("../../util/stringutil");
class ClassDecorator {
    constructor() { }
    static getDecoratorFunc(route) {
        return (target) => {
            const targetObj = ClassDecorator.targets.get(stringutil_1.StringUtil.hashCode(target.toString()));
            if (targetObj) {
                targetObj[ClassDecorator.CLASSMETADATA]['route'] = route;
            }
        };
    }
    static setHash(target) {
        ClassDecorator.ensureMetadata(target);
        if (!target[ClassDecorator.CLASSMETADATA]['hash']) {
            target[ClassDecorator.CLASSMETADATA]['hash'] = ClassDecorator.hash(target);
        }
    }
    static getHash(target) {
        ClassDecorator.setHash(target);
        return target[ClassDecorator.CLASSMETADATA]['hash'];
    }
    static addController(controller) {
        const controllerHash = ClassDecorator.hash(controller);
        const target = ClassDecorator.targets.get(controllerHash);
        if (target) {
            target[ClassDecorator.CLASSMETADATA][ClassDecorator.CLASSINSTANCE] = controller;
        }
    }
    static getController(target) {
        ClassDecorator.ensureMetadata(target);
        return target[ClassDecorator.CLASSMETADATA][ClassDecorator.CLASSINSTANCE];
    }
    static addRouteMethod(routeMethod, target) {
        ClassDecorator.setHash(target);
        const targetHash = ClassDecorator.getHash(target);
        if (!ClassDecorator.targets.has(targetHash)) {
            ClassDecorator.targets.set(targetHash, target);
        }
        ClassDecorator.routeMethods.push(Object.assign({}, routeMethod, { targetHash }));
    }
    static setRoutesExpress(expressServer) {
        const router = express_1.Router();
        ClassDecorator.createUrlListPage(router);
        for (const routeMethod of ClassDecorator.routeMethods) {
            ClassDecorator.addRouteExpress(routeMethod, router);
        }
        ClassDecorator.routeMethods = [];
        expressServer.use('/', router);
    }
    static setRoutesFastify(fastifyServer) {
        ClassDecorator.createUrlListPage(fastifyServer);
        ClassDecorator.addRoutesFastify(fastifyServer);
    }
    static hash(target) {
        return stringutil_1.StringUtil.hashCode(target.constructor.toString());
    }
    static ensureMetadata(target) {
        if (!target[ClassDecorator.CLASSMETADATA]) {
            target[ClassDecorator.CLASSMETADATA] = { hash: ClassDecorator.hash(target) };
        }
    }
    static addRouteExpress(routeMethod, router) {
        const target = ClassDecorator.targets.get(routeMethod.targetHash || 0);
        const baseRoute = target[ClassDecorator.CLASSMETADATA]['route'] || '';
        const useRoute = routeMethod.route === '/' && baseRoute ? '' : '/'.concat(routeMethod.route.replace(/^\//, ''));
        console_1.info('Add route to %s with method %s', baseRoute.concat(useRoute), routeMethod.method);
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
    static addRoutesFastify(fastifyServer) {
        for (const routeMethod of ClassDecorator.routeMethods) {
            const target = ClassDecorator.targets.get(routeMethod.targetHash || 0);
            const baseRoute = target[ClassDecorator.CLASSMETADATA]['route'] || '';
            const useRoute = routeMethod.route === '/' && baseRoute ? '' : '/'.concat(routeMethod.route.replace(/^\//, ''));
            console_1.info('Add route to %s with method %s', baseRoute.concat(useRoute), routeMethod.method);
            fastifyServer.route({
                method: routeMethod.method.toUpperCase(),
                url: baseRoute.concat(useRoute),
                handler: routeMethod.fastifyRouteFunc,
                beforeHandler: routeMethod.validators,
            });
        }
    }
    static createUrlListPage(router) {
        if (config_1.Configuration.getEnvironment() === environment_1.Environment.Production) {
            return;
        }
        console_1.info('Add route to /_urls with method GET');
        for (const routeMethod of ClassDecorator.routeMethods) {
            ClassDecorator.addUrl(routeMethod);
        }
        ClassDecorator.urls = `${ClassDecorator.htmlStart}${ClassDecorator.urls}${ClassDecorator.htmlEnd}`;
        if (router instanceof express_1.Router) {
            router.get('/_urls', (req, resp) => {
                resp.status(200).type('text/html; charset=utf-8').send(ClassDecorator.urls);
            });
        }
        else {
            router.get('/_urls', (req, resp) => {
                resp.status(200).type('text/html; charset=utf-8').send(ClassDecorator.urls);
            });
        }
    }
    static addUrl(routeMethod) {
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
ClassDecorator.CLASSMETADATA = 'classmetadata';
ClassDecorator.CLASSINSTANCE = 'classinstance';
ClassDecorator.URLS_ENDPOINT = '_urls';
ClassDecorator.htmlStart = '<!DOCTYPE html><html><head><meta charset="utf-8"> \
                                        <title>Urls</title></head><body>';
ClassDecorator.htmlEnd = '</body></html>';
ClassDecorator.targets = new Map();
ClassDecorator.routeMethods = [];
ClassDecorator.urls = '';
exports.ClassDecorator = ClassDecorator;
