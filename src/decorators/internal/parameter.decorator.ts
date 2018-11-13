import { Validation } from '../../validation/validators';
import { ClassDecorator } from './class.decorator';

export interface ParamDescriptor {
  index: number;
  name?: string;
  validation?: Validation;
  paramtype: ParamType;
}

export enum ParamType {
  QUERYPARAM = 'queryparam',
  PATHPARAM = 'pathparam',
  REQUEST = 'request',
  RESPONSE = 'response',
  USER = 'user',
}

export class ParameterDecorator {

  public static readonly PARAMETERMETADATA: string = 'parametermetadata';

  public static getDecoratorFunc(paramType: ParamType,
                                 paramName?: string,
                                 validation?: Validation) {
    return (controllerClass: any, methodName: string, index: number) => {
      const descriptors = ParameterDecorator.initTargetObject(paramType, controllerClass, methodName);
      descriptors.push({
        index,
        validation,
        paramtype: paramType,
        name: paramName,
      });
    };
  }

  // controllerClass.parametermetadata.methodName[paramData]
  private static initTargetObject(paramType: string, controllerClass: any, methodName: string): ParamDescriptor[] {
    if (!controllerClass[ParameterDecorator.PARAMETERMETADATA]) {
      controllerClass[ParameterDecorator.PARAMETERMETADATA] = [] as ParamDescriptor[];
    }
    if (!controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName]) {
      controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName] = [] as ParamDescriptor[];
    }
    // const name = ParameterDecorator.createKey(paramType, controllerClass, methodName);
    // if (!controllerClass[ParameterDecorator.PARAMETERMETADATA][name]) {
    //   controllerClass[ParameterDecorator.PARAMETERMETADATA][name] = [];
    // }
    // return controllerClass[ParameterDecorator.PARAMETERMETADATA][name];
    return controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName];
  }

  /**
   * Return a unique key in the form 'decoratortype@classname@methodname' that is used to store the
   * metadata  for parameters with decorators in a transfer object ('target')
   *
   * @static
   * @param {string} paramType
   * @param {*} controllerClass
   * @param {string} methodName
   * @returns {string}
   * @memberof ParamDecorator
   */
  public static createKey(paramType: string, controllerClass: any, methodName: string): string {
    const classHash: number = ClassDecorator.getHash(controllerClass);
    return `${paramType}@${classHash}@${methodName}`;
  }

}
