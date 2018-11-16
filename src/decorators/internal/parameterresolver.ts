import { Request, Response } from 'express';

import { RequestUtil } from '../../util/requestutil';
import { ParamDescriptor, ParamType, ParameterDecorator } from './parameter.decorator';

export class ParameterResolver {

  private constructor() { }

  public static resolveParams(request: Request,
                              response: Response,
                              controllerClass: any,
                              methodName: string): any[] {
    const paramDescriptors: ParamDescriptor[] = ParameterResolver.getParams(controllerClass, methodName);
    const parameters: any[] = [...Array<any>(paramDescriptors.length)];
    for (const descriptor of paramDescriptors) {
      switch (descriptor.paramtype) {
        case ParamType.QUERYPARAM:
          parameters[descriptor.index] = RequestUtil.getParameter(descriptor.name || '', request);
          break;
        case ParamType.PATHPARAM:
          parameters[descriptor.index] = RequestUtil.getPathParameter(descriptor.name || '', request);
          break;
        case ParamType.REQUEST:
          parameters[descriptor.index] = request;
          break;
        case ParamType.RESPONSE:
          parameters[descriptor.index] = response;
          break;
        case ParamType.USER:
          parameters[descriptor.index] = request.user || {};
          break;
      }
    }
    return parameters;
  }

  public static getParams(controllerClass: any, methodName: string): ParamDescriptor[] {
    if (controllerClass[ParameterDecorator.PARAMETERMETADATA]
      && controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName]) {
      return controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName];
    }
    return [];
  }

}
