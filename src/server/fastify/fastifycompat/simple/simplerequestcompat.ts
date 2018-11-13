import { IncomingMessage } from 'http';

import { Application } from 'express';
import { FastifyRequest } from 'fastify';

import { FastifyReq } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';

export class SimpleRequestCompat extends AbstractCompatProxy {

  private req: IncomingMessage;

  protected body: any;
  protected params: any;
  protected query: any;
  protected headers: any;
  protected path: string;
  protected response!: Response;

  protected constructor(protected fastifyRequest: FastifyRequest<any, any, any, any, any>,
                        protected app: Application) {
    super();
    this.req = this.fastifyRequest.req;

    this.body = this.fastifyRequest.body || {};
    this.params = this.fastifyRequest.params || {};
    this.query = this.fastifyRequest.query || {};
    this.headers = this.fastifyRequest.headers;
    const url = this.fastifyRequest.req.url;
    const questMark = url.indexOf('?');
    this.path = questMark >= 0 ? url.substring(0, questMark) : url;
  }

  public static getInstance(fastifyRequest: FastifyReq,
                            app: Application): any {
    return new SimpleRequestCompat(fastifyRequest, app).getCompatInstance('REQUEST');
  }

  public static getProxyInstance(fastifyRequest: FastifyReq,
                                 app: Application): any {
    return new SimpleRequestCompat(fastifyRequest, app).getCompatInstance('REQUEST', true);
  }

  public setResponse(response: Response): void {
    this.response = response;
  }

  protected getBaseHttpClass(): any {
    return this.req;
  }

  public accepts(type: string): boolean {
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
