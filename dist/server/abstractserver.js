"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const config_1 = require("../config/config");
const class_decorator_1 = require("../decorators/internal/class.decorator");
const winstonlogger_1 = require("../logger/winstonlogger");
const contentSecurityPolicyBuilder = require('content-security-policy-builder');
class AbstractServer {
    constructor(baseServer, corsServerUri = '*') {
        this.baseServer = baseServer;
        this.corsServerUri = corsServerUri;
        this.isShutdownCalled = false;
        this.server = baseServer;
        this.middlewares = [];
        this.staticEndpoints = [];
        this.passportStrategies = [];
    }
    startServer() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.initDefaultHeaders();
            this.initLogger();
            this.initCors(this.getCorsOptions());
            this.initCompression();
            this.initBodyParser();
            this.initPassportStrategies(this.passportStrategies);
            this.initMiddlewares();
            this.initRoutes();
            this.initStaticEndpoints(this.staticEndpoints);
            this.initShutdownListener();
            this.beforeStart();
            this.start();
        }
    }
    addMiddleware(path, handler) {
        this.middlewares.push({ path, handler });
    }
    addStaticFiles(directory, endpoint, index = 'index.html', allowInsecureContent = false, directives) {
        this.staticEndpoints.push({
            index,
            directives,
            path: endpoint || '/',
            dir: directory,
            insecureContent: allowInsecureContent,
        });
    }
    /**
     * Add controller that may handle request routes.
     *
     * It is expected these controllers are using annotations from {@link RoutingDecorator} to
     * configure the routes they are responsible for.
     *
     * @param {*} controller
     * @memberof AbstractExpressServer
     */
    addController(controller) {
        class_decorator_1.ClassDecorator.addController(controller);
    }
    addPassportStrategy(path, strategy) {
        this.passportStrategies.push({ path, strategy });
    }
    disableContentSecurityPolicy() {
        this.isContentSecurityPolicyDisabled = true;
    }
    initLogger() {
        if (config_1.Configuration.getBoolean('ENABLE_SERVER_LOG')) {
            const logger = winstonlogger_1.WinstonLogger.getServerLogger();
            this.server.use((req, res, done) => {
                logger(req, res, done);
            });
        }
    }
    initMiddlewares() {
        for (const middleware of this.middlewares) {
            this.server.use(middleware.path, middleware.handler);
        }
    }
    prepareDefaultHeaders() {
        const defHeaders = config_1.Configuration.getObject('DEFAULT_HTTP_HEADERS') || {};
        const defStaticHeaders = Object.assign({}, defHeaders, (config_1.Configuration.getObject('DEFAULT_HTTP_HEADERS_STATIC') || {}));
        return {
            headers: this.prepareHeaders(defHeaders),
            staticHeaders: this.prepareHeaders(defStaticHeaders),
        };
    }
    getCorsOptions() {
        return {
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: this.corsServerUri,
            preflightContinue: false,
        };
    }
    prepareHeaders(headers) {
        const headersMap = [];
        for (const name in headers) {
            if (name === 'Content-Security-Policy') {
                headersMap.push([name, contentSecurityPolicyBuilder({ directives: headers[name] })]);
            }
            else {
                headersMap.push([name, headers[name]]);
            }
        }
        return headersMap;
    }
    getSetHeadersFunc(staticEndpoint) {
        const cspHeader = this.getCSPHeader(staticEndpoint);
        return cspHeader
            ? (response, path, stat) => {
                if (path.endsWith('.html') || path.endsWith('.htm') || /\/[^\/\.]$/.test(path)) {
                    response.setHeader('Content-Security-Policy', cspHeader);
                }
            }
            : cspHeader;
    }
    getCSPHeader(staticEndpoint) {
        if (this.isContentSecurityPolicyDisabled || !staticEndpoint.directives) {
            return undefined;
        }
        return contentSecurityPolicyBuilder({ directives: this.prepareDirective(staticEndpoint) });
    }
    prepareDirective(endpoint) {
        if (!endpoint || (!endpoint.directives && !endpoint.insecureContent)) {
            return {
                defaultSrc: ["'self'"],
            };
        }
        const directives = endpoint.directives || { defaultSrc: ["'self'"] };
        if (!directives.defaultSrc) {
            directives.defaultSrc = ["'self'"];
        }
        if (endpoint.insecureContent) {
            directives.scriptSrc = directives.scriptSrc
                ? [...directives.scriptSrc, "'unsafe-eval'", "'unsafe-inline'"]
                : ["'self'", "'unsafe-eval'", "'unsafe-inline'"];
            directives.styleSrc = directives.styleSrc
                ? [...directives.styleSrc, "'unsafe-inline'"]
                : ["'self'", "'unsafe-inline'"];
        }
        return directives;
    }
    initShutdownListener() {
        process.once('SIGINT', async () => {
            await this.stopServer('SIGINT');
        });
        process.once('SIGTERM', async () => {
            await this.stopServer('SIGTERM');
        });
        process.once('SIGUSR2', async () => {
            await this.stopServer('SIGUSR2', false);
        });
    }
    async stopServer(signal, stopProcess = true) {
        if (!this.isShutdownCalled) {
            console_1.info('Stopping server...');
            try {
                this.isShutdownCalled = true;
                try {
                    await this.stop();
                }
                catch (e) {
                    console_1.error(e);
                }
                try {
                    await this.shutdown();
                }
                catch (e) {
                    console_1.error(e);
                }
                process.kill(process.pid, signal);
                process.exitCode = 0;
                if (stopProcess) {
                    setTimeout(() => process.exit(0), 5000);
                }
            }
            catch (e) {
                // error(e);
                process.exit(1);
            }
        }
    }
}
AbstractServer.DEFAULT_PORT = 3000;
exports.AbstractServer = AbstractServer;
