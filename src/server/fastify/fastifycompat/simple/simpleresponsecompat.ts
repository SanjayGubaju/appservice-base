import { ServerResponse } from 'http';

import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as mime from 'mime';
import * as statuses from 'statuses';

import { FastifyResp } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';

export class SimpleResponseCompat extends AbstractCompatProxy {

  protected request!: Request;
  protected readonly res: ServerResponse;
  protected statusCode: number;

  protected constructor(protected fastifyResponse: FastifyResp,
                        protected app: Application,
                        protected useProxy: boolean = false) {
    super();
    this.res = this.fastifyResponse.res;
    this.statusCode = 0;
  }

  public static getInstance(fastifyResponse: FastifyResp,
                            app: Application,
                            useProxy: boolean = false): any {
    return new SimpleResponseCompat(fastifyResponse, app).getCompatInstance('RESPONSE');
  }

  public static getProxyInstance(fastifyResponse: FastifyResp,
                                 app: Application): any {
    return new SimpleResponseCompat(fastifyResponse, app, true).getCompatInstance('RESPONSE', true);
  }

  public setRequest(request: Request): void {
    this.request = request;
  }

  protected getBaseHttpClass(): any {
    return this.res;
  }

  public status(statusCode: number): Response {
    this.fastifyResponse.status(statusCode);
    return <any>this;
  }

  public sendStatus(statusCode: number): Response {
    const body = statuses[statusCode] || String(statusCode);
    this.fastifyResponse.status(statusCode);
    this.type('txt');
    return this.send(body);
  }

  public send(body?: any): Response {
    if (!this.useProxy && this.statusCode) {
      this.fastifyResponse.status(this.statusCode);
    }
    this.fastifyResponse.serializer((payload: any) => payload);
    this.fastifyResponse.send(body);
    return <any>this;
  }

  public json(body?: any): Response {
    this.fastifyResponse.type('application/json; charset=utf-8');
    return this.send(body);
  }

  public contentType(type: string) : Response {
    return this.type(type);
  }

  public type(type: string) : Response {
    const contentType = type.indexOf('/') === -1 ? mime.getType(type) : type;
    this.fastifyResponse.type(contentType || type);
    return <any>this;
  }

  public set(field: string | any, value?: string): Response {
    return this.header(field, value);
  }

  public header(field: string | any, value?: string): Response {
    if (arguments.length === 2) {
      this.fastifyResponse.header(field, value);
    } else {
      for (const key in field) {
        this.fastifyResponse.header(key, field[key]);
      }
    }
    return <any>this;
  }

  public setHeader(field: string | any, value?: string): Response {
    return this.header(field, value);
  }

  public get(name: string) : string {
    return (<any>this.fastifyResponse).getHeader(name);
  }

  public redirect(url: string | number, status?: number | string): void {
    const useUrl: string = typeof url === 'string' ? url : String(status || '');
    const useStatus: number = typeof url === 'number' ? url : Number(status || 302);
    this.fastifyResponse.redirect(useStatus, useUrl);
  }

  public end(callback?: () => void) {
    if (!this.useProxy && this.statusCode) {
      this.res.statusCode = this.statusCode;
    }
    this.res.end(callback);
  }

}
