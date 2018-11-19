"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime = require("mime");
const statuses = require("statuses");
const abstractcompatproxy_1 = require("../abstractcompatproxy");
class SimpleResponseCompat extends abstractcompatproxy_1.AbstractCompatProxy {
    constructor(fastifyResponse, app, useProxy = false) {
        super();
        this.fastifyResponse = fastifyResponse;
        this.app = app;
        this.useProxy = useProxy;
        this.res = this.fastifyResponse.res;
        this.statusCode = 0;
    }
    static getInstance(fastifyResponse, app, useProxy = false) {
        return new SimpleResponseCompat(fastifyResponse, app).getCompatInstance('RESPONSE');
    }
    static getProxyInstance(fastifyResponse, app) {
        return new SimpleResponseCompat(fastifyResponse, app, true).getCompatInstance('RESPONSE', true);
    }
    setRequest(request) {
        this.request = request;
    }
    getBaseHttpClass() {
        return this.res;
    }
    status(statusCode) {
        this.fastifyResponse.status(statusCode);
        return this;
    }
    sendStatus(statusCode) {
        const body = statuses[statusCode] || String(statusCode);
        this.fastifyResponse.status(statusCode);
        this.type('txt');
        return this.send(body);
    }
    send(body) {
        if (!this.useProxy && this.statusCode) {
            this.fastifyResponse.status(this.statusCode);
        }
        this.fastifyResponse.serializer((payload) => payload);
        this.fastifyResponse.send(body);
        return this;
    }
    json(body) {
        this.fastifyResponse.type('application/json; charset=utf-8');
        return this.send(body);
    }
    contentType(type) {
        return this.type(type);
    }
    type(type) {
        const contentType = type.indexOf('/') === -1 ? mime.getType(type) : type;
        this.fastifyResponse.type(contentType || type);
        return this;
    }
    set(field, value) {
        return this.header(field, value);
    }
    header(field, value) {
        if (arguments.length === 2) {
            this.fastifyResponse.header(field, value);
        }
        else {
            for (const key in field) {
                this.fastifyResponse.header(key, field[key]);
            }
        }
        return this;
    }
    setHeader(field, value) {
        return this.header(field, value);
    }
    get(name) {
        return this.fastifyResponse.getHeader(name);
    }
    redirect(url, status) {
        const useUrl = typeof url === 'string' ? url : String(status || '');
        const statusCode = typeof url === 'number' ? url : Number(status || 302);
        console.log('redirect to %s', useUrl);
        // does not work currently
        // this.fastifyResponse.redirect(useStatus, useUrl);
        this.fastifyResponse.header('location', useUrl).code(statusCode).send('');
    }
    end(callback) {
        if (!this.useProxy && this.statusCode) {
            this.res.statusCode = this.statusCode;
        }
        this.res.end(callback);
    }
}
exports.SimpleResponseCompat = SimpleResponseCompat;
