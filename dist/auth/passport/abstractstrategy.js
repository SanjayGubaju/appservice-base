"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const passport = require("passport");
const passport_strategy_1 = require("passport-strategy");
const config_1 = require("../../config/config");
class AbstractStrategy extends passport_strategy_1.Strategy {
    /**
     * Creates an instance of AbstractJwtStrategy.
     * @param {(string[] | RegExp[])} [whitelist] List of regular expressions matching those paths
     * that should not checked for authentication, e.g. /login
     * @memberof AbstractJwtStrategy
     */
    constructor(whitelist, loginPath, registrationPath) {
        super();
        // TODO: use path-to-regexp?
        if (whitelist && whitelist.length) {
            if (typeof whitelist === 'string') {
                this.whitelist = [new RegExp(whitelist)];
            }
            else if (typeof whitelist[0] === 'string') {
                this.whitelist = whitelist.map(path => new RegExp(path));
            }
            else {
                this.whitelist = [...whitelist];
            }
        }
        this.errorMsg = JSON.stringify({
            error: 'Unauthorized',
            login: loginPath || config_1.Configuration.get('LOGIN_ENDPOINT'),
            registration: registrationPath || config_1.Configuration.get('REGISTRATION_ENDPOINT'),
        });
    }
    /**
     * Adds this passport strategy to the express router.
     *
     * @example
     * ````
     * // Assumed AuthJwtStrategy extends {@link AbstractJwtStrategy}
     * const authService = new AuthJwtStrategy(jwtService, ['/register', '/login']);
     * authService.addToExpress(this.express);
     * ```
     * @param {Express} express
     * @param {string} path
     * @memberof AbstractJwtStrategy
     */
    addToExpress(express, path = '/') {
        if (config_1.Configuration.getBoolean('ENABLE_AUTHENTICATION')) {
            passport.use(this.getStrategyName(), this);
            express.use(path, passport.initialize());
            express.all(path, this.getAuthFunc());
        }
    }
    getMiddleware() {
        if (config_1.Configuration.getBoolean('ENABLE_AUTHENTICATION')) {
            passport.use(this.getStrategyName(), this);
            return (request, response, next) => {
                passport.initialize()(request, response, () => { });
                this.getAuthFunc()(request, response, next);
            };
        }
        return null;
    }
    getAuthFunc() {
        return async (req, res, next) => {
            passport.authenticate(this.getStrategyName(), { session: false }, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const respType = this.getResponseType(req.headers['accept']);
                    res.status(401).type(respType).send(this.errorMsg);
                }
                else {
                    req['user'] = user;
                    req.authInfo = info;
                    next();
                }
            })(req, res, next);
        };
    }
    async authenticate(request, options) {
        if (this.isExcluded(request.path)) {
            this.pass();
        }
        else {
            try {
                const result = await this.authenticateRequest(request, options);
                this.success(result.user, result);
            }
            catch (e) {
                console_1.debug(e);
                this.fail(401);
            }
        }
    }
    isExcluded(path) {
        if (this.whitelist && this.whitelist.length) {
            for (const valueRegExp of this.whitelist) {
                if (valueRegExp.test(path)) {
                    return true;
                }
            }
        }
        else if (this.excludedPathsString && this.excludedPathsString.length) {
            for (const stringValue of this.excludedPathsString) {
                if (path === stringValue) {
                    return true;
                }
            }
        }
        return false;
    }
    getResponseType(acceptHeader = '') {
        const jsonType = 'application/json';
        if (acceptHeader && acceptHeader.indexOf(jsonType) >= 0
            || acceptHeader.indexOf('/*') >= 0
            || new RegExp(`[/+]${jsonType}[,;+]`).test(acceptHeader)) {
            return `${jsonType}; charset=utf-8`;
        }
        return 'text/plain; charset=utf-8';
    }
}
exports.AbstractStrategy = AbstractStrategy;
