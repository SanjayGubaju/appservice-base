"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const cookie = require("cookie");
const simpleresponsecompat_1 = require("../simple/simpleresponsecompat");
const encodeUrl = require('encodeurl');
const sign = require('sign');
class ResponseCompat extends simpleresponsecompat_1.SimpleResponseCompat {
    constructor(fastifyResponse, app, useProxy = false) {
        super(fastifyResponse, app, useProxy);
    }
    static getInstance(fastifyResponse, app) {
        return new ResponseCompat(fastifyResponse, app).getCompatInstance('REQUEST');
    }
    static getProxyInstance(fastifyResponse, app) {
        return new ResponseCompat(fastifyResponse, app, true).getCompatInstance('REQUEST', true);
    }
    links(links) {
        const link = `${(this.get('Link') || '')}, `;
        return this.set('Link', link + Object.keys(links).map((rel) => {
            return `<${links[rel]}>; rel="${rel}"`;
        }).join(', '));
    }
    jsonp(data) {
        const jsonpData = data || {};
        // settings
        const app = this.app;
        let body = this.fastifyResponse.serialize(jsonpData);
        // content-type
        if (!this.get('Content-Type')) {
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'application/json');
        }
        // fixup callback
        let callback = this.request.query[app.get('jsonp callback name')];
        if (Array.isArray(callback)) {
            callback = callback[0];
        }
        // jsonp
        if (typeof callback === 'string' && callback.length !== 0) {
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'text/javascript');
            // restrict callback charset
            callback = callback.replace(/[^\[\]\w$.]/g, '');
            // replace chars not allowed in JavaScript that are in JSON
            body = body
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029');
            // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
            // the typeof check is just to reduce client error noise
            body = `/**/ typeof ${callback} === 'function' && ${callback}(${body});`;
        }
        return this.send(body);
    }
    sendFile(path, errorCallbackOrOptions, errorCallback) {
        throw ('Method not implemented yet');
    }
    download(path, filenameOrErrorCallback, errorCallback) {
        throw ('Method not implemented yet');
    }
    format(obj) {
        throw ('Method not implemented yet');
    }
    attachment(filename) {
        throw ('Method not implemented yet');
    }
    clearCookie(name, options) {
        const opts = Object.assign({ expires: new Date(1), path: '/' }, options);
        this.cookie(name, '', opts);
        return this;
    }
    cookie(name, value, options) {
        const opts = options ? Object.assign({}, options) : {};
        const secret = this.request.secret;
        const signed = opts.signed;
        if (signed && !secret) {
            throw new Error('cookieParser("secret") required for signed cookies');
        }
        let val = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);
        if (signed) {
            val = `s:${sign(val, secret)}`;
        }
        if ('maxAge' in opts) {
            opts.expires = new Date(Date.now() + (opts.maxAge || 1000 * 60 * 60 * 24 * 30));
            opts.maxAge = (opts.maxAge || 1000 * 60 * 60 * 24 * 30) / 1000;
        }
        if (opts.path == null) {
            opts.path = '/';
        }
        this.fastifyResponse.header('Set-Cookie', cookie.serialize(name, String(val), opts));
        return this;
    }
    location(url) {
        let location = url;
        // "back" is an alias for the referrer
        if (location === 'back') {
            location = this.request.get('Referrer') || '/';
        }
        // set location
        return this.set('Location', encodeUrl(location));
    }
    render(view, options, callback) {
        throw ('Method not implemented yet');
    }
    append(field, value) {
        throw ('Method not implemented yet, use \'set\' directly instead');
    }
    vary(field) {
        const varyHeader = this.fastifyResponse.getHeader('Vary') || field;
        if (util_1.isArray(varyHeader)) {
            varyHeader.concat(field);
        }
        this.fastifyResponse.header('Vary', varyHeader);
        return this;
    }
}
exports.ResponseCompat = ResponseCompat;
