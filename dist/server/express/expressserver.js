"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http = require("http");
const path_1 = require("path");
const compression = require("compression");
const cors = require("cors");
const errorhandler = require("errorhandler");
const express = require("express");
const multer = require("multer");
const config_1 = require("../../config/config");
const environment_1 = require("../../config/environment");
const class_decorator_1 = require("../../decorators/internal/class.decorator");
const abstractserver_1 = require("../abstractserver");
http.globalAgent.maxSockets = Infinity;
class ExpressServer extends abstractserver_1.AbstractServer {
    constructor(port = abstractserver_1.AbstractServer.DEFAULT_PORT, env = environment_1.Environment.Development, corsServerUri = '*') {
        super(express(), corsServerUri);
        this.port = port;
        this.env = env;
        this.express = this.baseServer;
        this.express.set('env', this.env);
        this.express.set('x-powered-by', false);
        this.express.set('case sensitive routing', false);
        if (config_1.Configuration.getBoolean('BEHIND_PROXY')) {
            this.express.set('trust proxy', config_1.Configuration.get('TRUST_PROXY_SETTING') || true);
        }
    }
    startServer() {
        if (this.env === environment_1.Environment.Development) {
            this.express.use(errorhandler());
        }
        super.startServer();
    }
    start() {
        console_1.debug(this.express._router.stack);
        this.httpServer = this.express.listen(this.port, () => {
            console_1.info('App is running at http://localhost:%d in %s mode', this.port, this.env);
            console_1.info('Press CTRL-C to stop\n');
        });
    }
    beforeStart() { }
    async shutdown() { }
    initDefaultHeaders() {
        const { headers, staticHeaders } = this.prepareDefaultHeaders();
        this.express.use((request, response, done) => {
            const applyHeaders = this.isStaticHeaders(request) ? staticHeaders : headers;
            let length = applyHeaders.length;
            // tslint:disable-next-line:no-increment-decrement
            while (length--) {
                const keyvalue = applyHeaders[length];
                response.setHeader(keyvalue[0], keyvalue[1]);
            }
            done();
        });
    }
    isStaticHeaders(request) {
        const extension = request.url.match(/\.([^\/]+)$/);
        const notStaticExtensions = ['json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'js', 'css', 'woff', 'woff2'];
        return !extension || notStaticExtensions.includes(extension[1].toLowerCase());
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
        this.express.use(cors(options));
        this.express.options('*', cors(options));
    }
    initCompression() {
        if (config_1.Configuration.getBoolean('USE_COMPRESSION')) {
            this.express.use(compression());
        }
    }
    initBodyParser() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(multer({ dest: './uploads/' }).any());
    }
    initPassportStrategies(passportStrategies) {
        for (const strategy of passportStrategies) {
            strategy.strategy.addToExpress(this.express, strategy.path);
        }
    }
    initRoutes() {
        class_decorator_1.ClassDecorator.setRoutesExpress(this.express);
    }
    initStaticEndpoints(staticEndpoints) {
        for (const staticEndpoint of staticEndpoints) {
            this.express.use(staticEndpoint.path, express.static(path_1.resolve(staticEndpoint.dir), {
                setHeaders: this.getSetHeadersFunc(staticEndpoint),
                index: staticEndpoint.index || 'index.html',
            }));
        }
    }
    async stop() {
        return new Promise((resolve, reject) => {
            this.httpServer.close(() => {
                resolve();
            });
        });
    }
}
exports.ExpressServer = ExpressServer;
