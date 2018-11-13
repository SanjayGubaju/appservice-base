import * as accepts from 'accepts';
import { Application, MediaType, Response } from 'express';
import * as parseRange from 'range-parser';
// tslint:disable-next-line:no-duplicate-imports
import { Options, Ranges, Result } from 'range-parser';
import * as typeIs from 'type-is';

import { FastifyReq } from '../../../types';
import { SimpleRequestCompat } from '../simple/simplerequestcompat';

export class RequestCompat extends SimpleRequestCompat {

  private acceptHeader!: accepts.Accepts;

  private accepted!: MediaType[];
  private protocol!: string;
  private secure!: boolean;
  private ip!: string;
  private ips!: string[];
  private subdomains!: string[];
  private hostname!: string;
  private fresh!: boolean;
  private stale!: boolean;
  private xhr!: boolean;
  private cookies!: any;
  private route!: any;
  private signedCookies!: any;
  private originalUrl!: string;
  private baseUrl!: string;

  private constructor(fastifyRequest: FastifyReq,
                      app: Application) {
    super(fastifyRequest, app);
  }

  public static getInstance(fastifyRequest: FastifyReq,
                            app: Application): any {
    return new RequestCompat(fastifyRequest, app).getCompatInstance('REQUEST');
  }

  public static getProxyInstance(fastifyRequest: FastifyReq,
                                 app: Application): any {
    return new RequestCompat(fastifyRequest, app).getCompatInstance('REQUEST', true);
  }

  public get(name: string): any | string | string[] | undefined {
    return this.header(name);
  }

  public header(name: string): any | string | string[] | undefined {
    return this.fastifyRequest.req.headers[name];
  }

  public accepts(...type: any[]): string | string[] | boolean | any {
    this.initAcceptsHeader();
    return this.acceptHeader.types(type);
  }

  public acceptsCharsets(...charset: any[]): string | string[] | boolean | any {
    this.initAcceptsHeader();
    return this.acceptHeader.charsets(charset);
  }

  public acceptsEncodings(...encoding: any[]): string | string[] | boolean | any {
    this.initAcceptsHeader();
    return this.acceptHeader.encodings(encoding);
  }

  public acceptsLanguages(...lang: any[]): string | string[] | boolean | any {
    this.initAcceptsHeader();
    return this.acceptHeader.languages(lang);
  }

  private initAcceptsHeader(): void {
    if (!this.acceptHeader) {
      this.acceptHeader = accepts(this.fastifyRequest.req);
    }
  }

  public range(size: number, options ?: Options | undefined): Result | Ranges | undefined {
    const rangeHeader = this.get('Range');
    return rangeHeader ? parseRange(size, rangeHeader, options) : undefined;
  }

  public param(name: string, defaultValue ?: any): string {
    const params = this.fastifyRequest.params || {};
    const body = this.fastifyRequest.body || {};
    const query = this.fastifyRequest.query || {};
    if (params.hasOwnProperty(name) && params[name]) {
      return params[name];
    }
    return body[name] || query[name];
  }

  public is(type: string | string[]): string | false | null {
    return typeIs(this.fastifyRequest.req, Array.isArray(type) ? type : [type]);
  }

  public clearCookie(name: string, options?: any): Response {
    throw ('Method not implemented yet');
  }

}
