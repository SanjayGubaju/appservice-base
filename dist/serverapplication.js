"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth/controllers/auth.controller");
const exports_1 = require("./auth/exports");
const localjwtstrategy_1 = require("./auth/passport/strategies/localjwtstrategy");
const config_1 = require("./config/config");
const environment_1 = require("./config/environment");
const exports_2 = require("./database/exports");
const exports_3 = require("./email/exports");
const winstonlogger_1 = require("./logger/winstonlogger");
const expressserver_1 = require("./server/express/expressserver");
const fastifyserver_1 = require("./server/fastify/fastifyserver");
class ServerApplication {
    constructor() {
        winstonlogger_1.WinstonLogger.init();
        if (config_1.Configuration.get('MONGODB_URI')) {
            new exports_2.MongoDbStarter(config_1.Configuration.get('MONGODB_URI')).start();
        }
        this.defaultJwtService = new exports_1.DefaultJwtService(config_1.Configuration.get('AUTH_JWT_PRIVATE_KEY'), config_1.Configuration.get('AUTH_JWT_PUBLIC_KEY'));
        this.defaultEmailService = this.getEmailService();
    }
    start() {
        this.server.startServer();
    }
    getEmailService(from, defaultSubject, smtpData) {
        const config = Object.assign({}, ServerApplication.DEFAULT_EMAIL_CONFIG, (smtpData || {}));
        const fromAddress = from || config_1.Configuration.get('EMAIL_FROM');
        const defSubject = defaultSubject || config_1.Configuration.get('EMAIL_SUBJECT') || 'EMail Information';
        return new exports_3.EMailService(fromAddress, defSubject, config);
    }
    getDefaultJwtService() {
        return this.defaultJwtService;
    }
    getDefaultEmailService() {
        return this.defaultJwtService;
    }
    getServer(port, env, corsServerUri) {
        if (!this.server) {
            const serverport = port || config_1.Configuration.getNumber('SERVER_PORT', 3000);
            const environment = env || config_1.Configuration.getEnvironment() || environment_1.Environment.Development;
            this.server = config_1.Configuration.getBoolean('USE_FASTIFY')
                ? new fastifyserver_1.FastifyServer(serverport, environment, corsServerUri)
                : new expressserver_1.ExpressServer(serverport, environment, corsServerUri);
        }
        return this.server;
    }
    addAuthentication(authConfig) {
        if (!authConfig.strategy) {
            this.server.addPassportStrategy(authConfig.path || '', new localjwtstrategy_1.LocalJwtStrategy(this.defaultJwtService, authConfig.excludes));
        }
        else if (typeof authConfig.strategy === 'object') {
            this.server.addPassportStrategy(authConfig.path || '', authConfig.strategy);
        }
        else {
            const loginPath = authConfig.auth ? authConfig.auth.loginPath : null;
            const registrationPath = authConfig.auth ? authConfig.auth.registrationPath : null;
            this.server.addPassportStrategy(authConfig.path || '', new authConfig.strategy(this.defaultJwtService, authConfig.excludes, loginPath, registrationPath));
        }
        if (authConfig.auth) {
            this.server.addController(authConfig.auth.controller);
        }
        else if (!this.isAuthCtrlSet) {
            this.server.addController(new auth_controller_1.AuthenticationController(new exports_1.AuthenticationService(this.defaultJwtService, this.defaultEmailService)));
        }
    }
}
ServerApplication.DEFAULT_EMAIL_CONFIG = {
    host: config_1.Configuration.get('EMAIL_HOST', 'localhost'),
    port: config_1.Configuration.getNumber('EMAIL_PORT', 587),
    user: config_1.Configuration.get('EMAIL_USER'),
    password: config_1.Configuration.get('EMAIL_PASSWORD'),
    secure: config_1.Configuration.getBoolean('EMAIL_SECURE'),
    ignoreTLS: config_1.Configuration.getBoolean('EMAIL_IGNORE_TLS'),
    requireTLS: config_1.Configuration.getBoolean('EMAIL_REQUIRE_TLS'),
    tls: config_1.Configuration.getObject('EMAIL_TLS'),
};
exports.ServerApplication = ServerApplication;
