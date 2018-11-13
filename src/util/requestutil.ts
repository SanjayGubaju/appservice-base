import { Request } from 'express';

export class RequestUtil {

  private constructor() { }

  public static getParameter(name: string, request: Request) {
    return request.body[name] || request.query[name];
  }

  public static getPathParameter(name: string, request: Request) {
    return request.params[name];
  }
}
