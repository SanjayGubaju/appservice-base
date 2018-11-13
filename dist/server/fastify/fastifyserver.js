"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http = require("http");
const path_1 = require("path");
const fastify = require("fastify");
const cors = require("fastify-cors");
const config_1 = require("../../config/config");
const environment_1 = require("../../config/environment");
const class_decorator_1 = require("../../decorators/internal/class.decorator");
const abstractserver_1 = require("../abstractserver");
const simpleapplicationcompat_1 = require("./fastifycompat/simple/simpleapplicationcompat");
const simplerequestcompat_1 = require("./fastifycompat/simple/simplerequestcompat");
const simpleresponsecompat_1 = require("./fastifycompat/simple/simpleresponsecompat");
const applicationcompat_1 = require("./fastifycompat/extended/applicationcompat");
const requestcompat_1 = require("./fastifycompat/extended/requestcompat");
const responsecompat_1 = require("./fastifycompat/extended/responsecompat");
http.globalAgent.maxSockets = Infinity;
class FastifyServer extends abstractserver_1.AbstractServer {
    constructor(port = abstractserver_1.AbstractServer.DEFAULT_PORT, env = environment_1.Environment.Development, corsServerUri = '*') {
        super(fastify({
            https: false,
            http2: false,
            logger: false,
            caseSensitive: false,
            trustProxy: config_1.Configuration.getBoolean('BEHIND_PROXY') ? config_1.Configuration.get('TRUST_PROXY_SETTING') || true : null,
        }), corsServerUri);
        this.port = port;
        this.env = env;
        this.fastifyServer = this.baseServer;
        this.middlewarescompat = new Map();
        this.app = this.getCompatApplicationLayer(this.fastifyServer);
        this.app.set('env', this.env);
    }
    addMiddlewareCompat(pathOrHandler, handler) {
        const path = typeof pathOrHandler === 'string' ? pathOrHandler : '';
        const reqHandler = typeof pathOrHandler === 'string' ? handler : pathOrHandler;
        if (reqHandler != null) {
            if (!this.middlewarescompat.has(path)) {
                this.middlewarescompat.set(path, []);
            }
            this.middlewarescompat.get(path).push({
                middleware: reqHandler,
                iserrhandler: reqHandler['prototype'] && reqHandler.prototype.constructor.length === 4,
            });
        }
    }
    start() {
        this.initCompatMiddlewares();
        this.fastifyServer.listen(this.port, config_1.Configuration.get('SERVER_ADDRESS'))
            .then((address) => {
            console_1.info('App is running at %s in %s mode', address, this.env);
            console_1.info('Press CTRL-C to stop\n');
        })
            .catch((err) => {
            console_1.info('Error starting server:', err);
            console_1.error(err);
            process.exit(1);
        });
    }
    beforeStart() { }
    async shutdown() { }
    initDefaultHeaders() {
        const { headers, staticHeaders } = this.prepareDefaultHeaders();
        this.fastifyServer.addHook('onSend', (request, response, payload, done) => {
            const applyHeaders = response.getHeader('content-type').startsWith('text/html')
                ? staticHeaders
                : headers;
            let length = applyHeaders.length;
            // tslint:disable-next-line:no-increment-decrement
            while (length--) {
                const keyvalue = applyHeaders[length];
                if (!response.getHeader(keyvalue[0])) {
                    response.header(keyvalue[0], keyvalue[1]);
                }
            }
            done();
        });
    }
    /**
     * Adds and configures the following middleware:
     *
     * * cors
     *
     * @protected
     * @memberof AbstractExpressServer
     */
    initCors(options) {
        this.fastifyServer.register(cors, options);
        // this.fastifyServer.options('*', (request, reply) => { reply.send(); });
    }
    initCompression() {
        if (config_1.Configuration.getBoolean('USE_COMPRESSION')) {
            this.fastifyServer.register(require('fastify-compress'));
        }
    }
    initBodyParser() {
        this.fastifyServer.register(require('fastify-formbody'));
        if (config_1.Configuration.getBoolean('ALLOW_FILE_UPLOAD')) {
            this.fastifyServer.register(require('fastify-file-upload'), {
                limits: { fileSize: 50 * 1024 * 1024 },
                safeFileNames: true,
                preserveExtension: true,
                abortOnLimit: true,
            });
        }
    }
    initPassportStrategies(passportStrategies) {
        for (const strategy of passportStrategies) {
            this.addMiddlewareCompat(strategy.path, strategy.strategy.getMiddleware());
        }
    }
    initRoutes() {
        class_decorator_1.ClassDecorator.setRoutesFastify(this.fastifyServer);
    }
    async stop() {
        return new Promise((resolve, reject) => {
            this.fastifyServer.close(() => {
                resolve();
            });
        });
    }
    initStaticEndpoints(staticEndpoints) {
        for (const staticEndpoint of staticEndpoints) {
            this.fastifyServer.register(require('fastify-static'), {
                setHeaders: this.getSetHeadersFunc(staticEndpoint),
                root: path_1.resolve(staticEndpoint.dir),
                prefix: staticEndpoint.path,
                index: `/${staticEndpoint.index || 'index.html'}`,
            });
        }
    }
    initCompatMiddlewares() {
        for (const [path, middlewares] of this.middlewarescompat.entries()) {
            const handler = (request, response, done) => {
                Reflect.set(request, 'compatmiddleware', [...middlewares]);
                done();
            };
            if (path) {
                this.fastifyServer.use(path, handler);
            }
            else {
                this.fastifyServer.use(handler);
            }
        }
        this.fastifyServer.addHook('preHandler', (request, response, next) => {
            const req = this.getCompatRequestLayer(request, this.app);
            const resp = this.getCompatResponseLayer(response, this.app);
            req.setResponse(resp);
            resp.setRequest(req);
            request.expressRequest = req;
            response.expressResponse = resp;
            const compatmiddlewares = Reflect.get(request.req, 'compatmiddleware') || [];
            let count = 0;
            const nextFunc = async () => {
                if (compatmiddlewares.length > count) {
                    count += 1;
                    const compatmiddleware = compatmiddlewares[count - 1];
                    if (compatmiddleware.iserrhandler) {
                        compatmiddleware.middleware({}, req, resp, nextFunc);
                    }
                    else {
                        compatmiddleware.middleware(req, resp, nextFunc);
                    }
                }
                else {
                    next();
                }
            };
            try {
                nextFunc();
            }
            catch (e) {
                console_1.error(e);
                response.status(400);
                next(`${e}`);
            }
        });
    }
    getCompatApplicationLayer(fastifyServer) {
        switch (config_1.Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
            case 1: return applicationcompat_1.ApplicationCompat.getProxyInstance(fastifyServer);
            case 2: return applicationcompat_1.ApplicationCompat.getInstance(fastifyServer);
            case 3: return simpleapplicationcompat_1.SimpleApplicationCompat.getProxyInstance(fastifyServer);
            default: return simpleapplicationcompat_1.SimpleApplicationCompat.getInstance(fastifyServer);
        }
    }
    getCompatRequestLayer(request, app) {
        switch (config_1.Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
            case 1: return requestcompat_1.RequestCompat.getProxyInstance(request, app);
            case 2: return requestcompat_1.RequestCompat.getInstance(request, app);
            case 3: return simplerequestcompat_1.SimpleRequestCompat.getProxyInstance(request, app);
            default: return simplerequestcompat_1.SimpleRequestCompat.getInstance(request, app);
        }
    }
    getCompatResponseLayer(response, app) {
        switch (config_1.Configuration.getNumber('FASTIFY_COMPAT_LEVEL', 4)) {
            case 1: return responsecompat_1.ResponseCompat.getProxyInstance(response, app);
            case 2: return responsecompat_1.ResponseCompat.getInstance(response, app);
            case 3: return simpleresponsecompat_1.SimpleResponseCompat.getProxyInstance(response, app);
            default: return simpleresponsecompat_1.SimpleResponseCompat.getInstance(response, app);
        }
    }
}
exports.FastifyServer = FastifyServer;
