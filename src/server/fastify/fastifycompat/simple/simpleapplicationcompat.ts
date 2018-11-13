import { Application } from 'express';

import { FastifyServer } from '../../../types';
import { AbstractCompatProxy } from '../abstractcompatproxy';

export class SimpleApplicationCompat extends AbstractCompatProxy {

  private app!: Application;
  private props: Map<any, any>;

  protected constructor(private fastifyApplication: FastifyServer) {
    super();
    this.props = new Map<any, any>();
  }

  public static getInstance(fastifyApplication: FastifyServer): any {
    return new SimpleApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION');
  }

  public static getProxyInstance(fastifyApplication: FastifyServer): any {
    return new SimpleApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION', true);
  }

  protected getBaseHttpClass(): any {
    return {};
  }

  public set(name: any, value: any): Application {
    this.props.set(name, value);
    return this.app;
  }

  public get(name: any): any {
    return this.props.get(name);
  }

}
