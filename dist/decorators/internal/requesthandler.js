"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const check_1 = require("express-validator/check");
const stringify = require("safe-stable-stringify");
const environment_1 = require("../../config/environment");
const datatype_1 = require("../../util/datatype");
const class_decorator_1 = require("./class.decorator");
const parameter_decorator_1 = require("./parameter.decorator");
const parameterresolver_1 = require("./parameterresolver");
class RequestHandler {
    constructor(controllerClass, methodName, request, response, originalMethod, statusSuccess = 200, statusError = 400, type, skipValidation = false) {
        this.controllerClass = controllerClass;
        this.methodName = methodName;
        this.request = request;
        this.response = response;
        this.originalMethod = originalMethod;
        this.statusSuccess = statusSuccess;
        this.statusError = statusError;
        this.type = type;
        this.skipValidation = skipValidation;
    }
    async executeRequest() {
        let isValidation = true;
        try {
            // get controller instance
            const controller = class_decorator_1.ClassDecorator.getController(this.controllerClass);
            if (!controller && this.controllerClass.constructor.length > 0) {
                console_1.warn('No controller instance %s found. Did you add the controller to the express server?', this.controllerClass.constructor.name);
                return this.sendResponse(404, 'Page not found', true);
            }
            // resolve parameters
            let parameters = [];
            if (this.controllerClass[parameter_decorator_1.ParameterDecorator.PARAMETERMETADATA]) {
                parameters = parameterresolver_1.ParameterResolver.resolveParams(this.request, this.response, this.controllerClass, this.methodName);
                // validate request params and send response if controller method returns a value
                if (!this.skipValidation) {
                    this.validateRequestParams();
                }
            }
            isValidation = false;
            const resp = await this.originalMethod.apply(controller, parameters);
            this.sendResponse(this.statusSuccess, resp, false);
        }
        catch (err) {
            let respData;
            if (isValidation) {
                respData = err;
            }
            else {
                console_1.debug(err);
                respData = this.request.app.get('env') === environment_1.Environment.Development ? err : 'Request failed';
                if (err instanceof Error) {
                    respData = err.message.trim();
                }
            }
            this.sendResponse(this.statusError, respData, true);
        }
    }
    sendResponse(status, data, isError) {
        if (status === 301 || status === 302) {
            this.response.redirect(status, data);
            return;
        }
        if (this.type && !this.type.startsWith('application/json')) {
            this.response.status(status).type(this.type).send(datatype_1.DataType.isString(data) ? this.escapeHtml(data, false) : data);
        }
        else {
            const isJson = this.isJson(data);
            if (isJson) {
                this.sendJson(status, data);
            }
            else if (!isJson && (this.type
                || (!this.request.accepts('text/plain') && this.request.accepts('application/json')))) {
                const key = isError ? 'error' : 'response';
                this.sendJson(status, data, key);
            }
            else {
                this.response.status(status).type('text/plain; charset=utf-8').send(this.escapeHtml(String(data), false));
            }
        }
    }
    sendJson(status, data, key) {
        const replacer = (name, value) => this.escapeHtml(value);
        let jsonData;
        if (key) {
            // tslint:disable-next-line:max-line-length
            jsonData = `{ "${key}": "${datatype_1.DataType.isString(data) ? this.escapeHtml(data) : stringify.default(data, replacer)}" }`;
        }
        else {
            jsonData = datatype_1.DataType.isString(data) ? this.escapeHtml(data) : stringify.default(data, replacer);
        }
        this.response.status(status).type('application/json; charset=utf-8').send(jsonData);
    }
    validateRequestParams() {
        const errors = check_1.validationResult(this.request);
        if (!errors.isEmpty()) {
            if (this.request.app.get('env') === environment_1.Environment.Development) {
                throw ({ errors: errors.array() });
            }
            else {
                const errorList = [...errors.array()];
                for (const error of errorList) {
                    delete error.param;
                    if (error.nestedErrors) {
                        for (const nestedError of error.nestedErrors) {
                            delete nestedError.location;
                            delete nestedError.value;
                        }
                    }
                }
                throw ({ errors: errorList });
            }
        }
    }
    isJson(data) {
        // is object --> OK
        if (data && typeof data === 'object'
            && data.constructor !== RegExp
            && data.constructor !== Date
            && data.constructor !== Number
            && data.constructor !== Error) {
            return true;
        }
        // is array --> IK
        if (data && Array.isArray(data)) {
            return true;
        }
        // is JSON string --> OK
        // Note: This is a very simple test but more advanced tests like trying to parse string as JSON
        // comes with significant performance drawbacks
        if (data && (typeof data === 'string' || data instanceof String)
            && /^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            return true;
        }
        return false;
    }
    escapeHtml(value, isJson = true) {
        if (typeof value !== 'string') {
            return value;
        }
        return value.replace(/[<>&]/g, (char) => {
            switch (char) {
                case '<':
                    return isJson ? '\\u003c' : '&lt;';
                case '>':
                    return isJson ? '\\u003e' : '&gt;';
                case '&':
                    return isJson ? '\\u0026' : '&amp;';
                default:
                    return char;
            }
        });
    }
}
exports.RequestHandler = RequestHandler;
