import { debug, warn } from 'console';

import { Request, Response } from 'express';
import { Result, validationResult } from 'express-validator/check';
import * as stringify from 'safe-stable-stringify';

import { Environment } from '../../config/environment';
import { DataType } from '../../util/datatype';
import { ClassDecorator } from './class.decorator';
import { ParameterDecorator } from './parameter.decorator';
import { ParameterResolver } from './parameterresolver';

export class RequestHandler {

  constructor(private controllerClass: any,
              private methodName: string,
              private request: Request,
              private response: Response,
              private originalMethod: () => {},
              private statusSuccess: number = 200,
              private statusError: number = 400,
              private type: string,
              private skipValidation: boolean = false) { }

  public async executeRequest(): Promise<void> {
    let isValidation = true;
    try {

      // get controller instance
      const controller: any = ClassDecorator.getController(this.controllerClass);
      if (!controller && this.controllerClass.constructor.length > 0) {
        warn('No controller instance %s found. Did you add the controller to the express server?',
             this.controllerClass.constructor.name);
        return this.sendResponse(404, 'Page not found', true);
      }

      // resolve parameters
      let parameters: any[] = ['test'];
      if (this.controllerClass[ParameterDecorator.PARAMETERMETADATA]) {
        parameters = ParameterResolver.resolveParams(this.request,
                                                     this.response,
                                                     this.controllerClass,
                                                     this.methodName);
        // validate request params and send response if controller method returns a value
        if (!this.skipValidation) {
          this.validateRequestParams();
        }
      }

      isValidation = false;
      const resp = await this.originalMethod.apply(controller, parameters);
      this.sendResponse(this.statusSuccess, resp, false);
    } catch (err) {
      let respData;
      if (isValidation) {
        respData = err;
      } else {
        debug(err);
        respData = this.request.app.get('env') === Environment.Development ? err : 'Request failed';
        if (err instanceof Error) {
          respData = err.message.trim();
        }
      }
      this.sendResponse(this.statusError, respData, true);
    }
  }

  private sendResponse(status: number, data: any, isError: boolean): void {
    if (this.type && !this.type.startsWith('application/json')) {
      this.response.status(status).type(this.type).send(DataType.isString(data) ? this.escapeHtml(data, false) : data);
    } else {
      const isJson = this.isJson(data);
      if (isJson) {
        this.sendJson(status, data);
      } else if (!isJson && (this.type
        || (!this.request.accepts('text/plain') && this.request.accepts('application/json')))) {
        const key = isError ? 'error' : 'response';
        this.sendJson(status, data, key);
      } else {
        this.response.status(status).type('text/plain; charset=utf-8').send(this.escapeHtml(String(data), false));
      }
    }
  }

  private sendJson(status: number, data: any, key?: string): void {
    const replacer = (name: string, value: string) => this.escapeHtml(value);
    let jsonData;
    if (key) {
      // tslint:disable-next-line:max-line-length
      jsonData = `{ "${key}": "${DataType.isString(data) ? this.escapeHtml(data) : stringify.default(data, replacer)}" }`;
    } else {
      jsonData = DataType.isString(data) ? this.escapeHtml(data) : stringify.default(data, replacer);
    }
    this.response.status(status).type('application/json; charset=utf-8').send(jsonData);
  }

  private validateRequestParams(): void | Error {
    const errors: Result = validationResult(this.request);
    if (!errors.isEmpty()) {
      if (this.request.app.get('env') === Environment.Development) {
        throw ({ errors: errors.array() });
      } else {
        const errorList = [...errors.array()];
        for (const error of errorList) {
          delete error.param;
          if ((<any>error).nestedErrors) {
            for (const nestedError of (<any>error).nestedErrors) {
              delete nestedError.location;
              delete nestedError.value;
            }
          }
        }
        throw ({ errors: errorList });
      }
    }
  }

  private isJson(data: any): boolean {
    // is object --> OK
    if (data && typeof data === 'object'
      && data.constructor !== RegExp
      && data.constructor !== Date
      && data.constructor !== Number
      && data.constructor !== Error) {
      return true;
    }
    // is array --> IK
    if (data && Array.isArray(data)) {
      return true;
    }
    // is JSON string --> OK
    // Note: This is a very simple test but more advanced tests like trying to parse string as JSON
    // comes with significant performance drawbacks
    if (data && (typeof data === 'string' || data instanceof String)
      && /^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      return true;
    }
    return false;
  }

  private escapeHtml(value: any, isJson: boolean = true): string {
    if (typeof value !== 'string') {
      return value;
    }
    return <string>value.replace(/[<>&]/g, (char) => {
      switch (char) {
        case '<':
          return isJson ? '\\u003c' : '&lt;';
        case '>':
          return isJson ? '\\u003e' : '&gt;';
        case '&':
          return isJson ? '\\u0026' : '&amp;';
        default:
          return char;
      }
    });
  }
}
