"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accepts = require("accepts");
const parseRange = require("range-parser");
const typeIs = require("type-is");
const simplerequestcompat_1 = require("../simple/simplerequestcompat");
class RequestCompat extends simplerequestcompat_1.SimpleRequestCompat {
    constructor(fastifyRequest, app) {
        super(fastifyRequest, app);
    }
    static getInstance(fastifyRequest, app) {
        return new RequestCompat(fastifyRequest, app).getCompatInstance('REQUEST');
    }
    static getProxyInstance(fastifyRequest, app) {
        return new RequestCompat(fastifyRequest, app).getCompatInstance('REQUEST', true);
    }
    get(name) {
        return this.header(name);
    }
    header(name) {
        return this.fastifyRequest.req.headers[name];
    }
    accepts(...type) {
        this.initAcceptsHeader();
        return this.acceptHeader.types(type);
    }
    acceptsCharsets(...charset) {
        this.initAcceptsHeader();
        return this.acceptHeader.charsets(charset);
    }
    acceptsEncodings(...encoding) {
        this.initAcceptsHeader();
        return this.acceptHeader.encodings(encoding);
    }
    acceptsLanguages(...lang) {
        this.initAcceptsHeader();
        return this.acceptHeader.languages(lang);
    }
    initAcceptsHeader() {
        if (!this.acceptHeader) {
            this.acceptHeader = accepts(this.fastifyRequest.req);
        }
    }
    range(size, options) {
        const rangeHeader = this.get('Range');
        return rangeHeader ? parseRange(size, rangeHeader, options) : undefined;
    }
    param(name, defaultValue) {
        const params = this.fastifyRequest.params || {};
        const body = this.fastifyRequest.body || {};
        const query = this.fastifyRequest.query || {};
        if (params.hasOwnProperty(name) && params[name]) {
            return params[name];
        }
        return body[name] || query[name];
    }
    is(type) {
        return typeIs(this.fastifyRequest.req, Array.isArray(type) ? type : [type]);
    }
    clearCookie(name, options) {
        throw ('Method not implemented yet');
    }
}
exports.RequestCompat = RequestCompat;
