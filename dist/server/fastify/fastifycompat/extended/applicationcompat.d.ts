import { FastifyServer } from '../../../types';
import { SimpleApplicationCompat } from '../simple/simpleapplicationcompat';
export declare class ApplicationCompat extends SimpleApplicationCompat {
    static getInstance(fastifyApplication: FastifyServer): any;
    static getProxyInstance(fastifyApplication: FastifyServer): any;
}
