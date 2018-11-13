import { FastifyServer } from '../../../types';
import { SimpleApplicationCompat } from '../simple/simpleapplicationcompat';

export class ApplicationCompat extends SimpleApplicationCompat {

  public static getInstance(fastifyApplication: FastifyServer): any {
    return new ApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION');
  }

  public static getProxyInstance(fastifyApplication: FastifyServer): any {
    return new ApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION', true);
  }

}
