"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractcompatproxy_1 = require("../abstractcompatproxy");
class SimpleRequestCompat extends abstractcompatproxy_1.AbstractCompatProxy {
    constructor(fastifyRequest, app) {
        super();
        this.fastifyRequest = fastifyRequest;
        this.app = app;
        this.req = this.fastifyRequest.req;
        this.body = this.fastifyRequest.body || {};
        this.params = this.fastifyRequest.params || {};
        this.query = this.fastifyRequest.query || {};
        this.headers = this.fastifyRequest.headers;
        const url = this.fastifyRequest.req.url;
        const questMark = url.indexOf('?');
        this.path = questMark >= 0 ? url.substring(0, questMark) : url;
    }
    static getInstance(fastifyRequest, app) {
        return new SimpleRequestCompat(fastifyRequest, app).getCompatInstance('REQUEST');
    }
    static getProxyInstance(fastifyRequest, app) {
        return new SimpleRequestCompat(fastifyRequest, app).getCompatInstance('REQUEST', true);
    }
    setResponse(response) {
        this.response = response;
    }
    getBaseHttpClass() {
        return this.req;
    }
    accepts(type) {
        let acceptHeader = this.headers.accept;
        if (!acceptHeader) {
            return true;
        }
        acceptHeader = `,${acceptHeader},`;
        return acceptHeader.indexOf(type) >= 0
            || acceptHeader.indexOf('/*') >= 0
            || new RegExp(`[/+]${type}[,;+]`).test(acceptHeader);
    }
}
exports.SimpleRequestCompat = SimpleRequestCompat;
