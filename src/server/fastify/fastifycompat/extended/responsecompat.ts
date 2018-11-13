import { isArray } from 'util';

import * as cookie from 'cookie';
import { CookieOptions, Errback, Response } from 'express';
import { Application } from 'express-serve-static-core';

import { FastifyResp } from '../../../types';
import { SimpleResponseCompat } from '../simple/simpleresponsecompat';

const encodeUrl = require('encodeurl');
const sign = require('sign');

export class ResponseCompat extends SimpleResponseCompat {

  private constructor(fastifyResponse: FastifyResp,
                      app: Application,
                      useProxy: boolean = false) {
    super(fastifyResponse, app, useProxy);
  }

  public static getInstance(fastifyResponse: FastifyResp,
                            app: Application): any {
    return new ResponseCompat(fastifyResponse, app).getCompatInstance('REQUEST');
  }

  public static getProxyInstance(fastifyResponse: FastifyResp,
                                 app: Application): any {
    return new ResponseCompat(fastifyResponse, app, true).getCompatInstance('REQUEST', true);
  }

  public links(links: any): Response {
    const link = `${(this.get('Link') || '')}, `;
    return this.set('Link', link + Object.keys(links).map((rel) => {
      return `<${links[rel]}>; rel="${rel}"`;
    }).join(', '));
  }

  public jsonp(data?: any): Response {
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

  public sendFile(path: string, errorCallbackOrOptions?: Errback | any, errorCallback?: Errback): void {
    throw ('Method not implemented yet');
  }

  public download(path: string, filenameOrErrorCallback?: string | Errback, errorCallback?: Errback): void {
    throw ('Method not implemented yet');
  }

  public format(obj: any): Response {
    throw ('Method not implemented yet');
  }

  public attachment(filename?: string): Response {
    throw ('Method not implemented yet');
  }

  public clearCookie(name: string, options?: any): Response {
    const opts = { ...{ expires: new Date(1), path: '/' }, ...options };
    this.cookie(name, '', opts);
    return <any>this;
  }

  public cookie(name: string, value: any, options?: CookieOptions): Response {
    const opts = options ? { ...options } : {};
    const secret = (<any>this.request).secret;
    const signed = opts.signed;

    if (signed && !secret) {
      throw new Error('cookieParser("secret") required for signed cookies');
    }

    let val: string = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

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

    this.fastifyResponse.header('Set-Cookie', cookie.serialize(name, String(val), <any>opts));
    return <any>this;
  }

  public location(url: string): Response {
    let location = url;
    // "back" is an alias for the referrer
    if (location === 'back') {
      location = this.request.get('Referrer') || '/';
    }
    // set location
    return this.set('Location', encodeUrl(location));
  }

  public render(view: string, options?: Object, callback?: (err: Error, html: string) => void): void {
    throw ('Method not implemented yet');
  }

  public append(field: string, value?: string[] | string): Response {
    throw ('Method not implemented yet, use \'set\' directly instead');
  }

  public vary(field: string): Response {
    const varyHeader = (<any>this.fastifyResponse).getHeader('Vary') || field;
    if (isArray(varyHeader)) {
      varyHeader.concat(field);
    }
    this.fastifyResponse.header('Vary', varyHeader);
    return <any>this;
  }

}
