import { RequestHandler } from 'express';
import { ValidationChain, check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';

import { Validation, Validators } from '../../../validation/validators';
import { ParamDescriptor } from '../parameter.decorator';
import { ParameterResolver } from '../parameterresolver';

export class ExpressValidationResolver {

  private constructor() { }

  public static getValidationRules(controllerClass: any,
                                   methodName: string,
                                   validationchain?: RequestHandler[]): RequestHandler[] {
    const validators: RequestHandler[] = validationchain ? validationchain : [];
    const descriptors: ParamDescriptor[] = ParameterResolver.getParams(controllerClass, methodName);
    for (const descriptor of descriptors) {
      if (descriptor.name) {
        validators.push(sanitize(descriptor.name).trim());
        if (!validationchain && descriptor.validation) {
          let validationFunc: ValidationChain = check(descriptor.name);
          // add correct type to check e.g. check().isEmail()
          validationFunc = this.expandValidationFunc(descriptor.validation, descriptor.name, validationFunc);
          validators.push(validationFunc);
        }
      }
    }
    return validators;
  }

  private static expandValidationFunc(paramValidation: Validation,
                                      name: string,
                                      validationFunc: ValidationChain,
                                      message?: string): ValidationChain {
    let valFunc = paramValidation.required ? validationFunc : validationFunc.optional();
    let type: string;
    let msg;
    switch (paramValidation.type) {
      case Validators.Alpha:
        type = 'letters only';
        valFunc = valFunc.isAlpha();
        break;
      case Validators.Alphanumeric:
        type = 'letters and numbers only';
        valFunc = valFunc.isAlphanumeric();
        break;
      case Validators.Ascii:
        type = 'ascii chars only';
        valFunc = valFunc.isAscii();
        break;
      case Validators.Base64:
        type = 'Base64';
        valFunc = valFunc.isBase64();
        break;
      case Validators.Before:
        msg = message ? message : `Parameter "${name}" is not before now`;
        return valFunc.isBefore().withMessage(msg);
      case Validators.Boolean:
        type = 'boolean';
        valFunc = valFunc.isBoolean();
        break;
      case Validators.Decimal:
        type = 'decimal';
        valFunc = valFunc.isDecimal();
        break;
      case Validators.Email:
        msg = message ? message : `Parameter "${name}" is not a valid email address`;
        return valFunc.isEmail().normalizeEmail().withMessage(msg);
      case Validators.Float:
        type = 'float';
        valFunc = valFunc.isFloat();
        break;
      case Validators.ISO8601:
        type = 'ISO8601';
        valFunc = valFunc.isISO8601();
        break;
      case Validators.JSON:
        type = 'JSON';
        valFunc = valFunc.isJSON();
        break;
      case Validators.Numeric:
        msg = message ? message : `Parameter "${name}" is not numeric`;
        return valFunc.isNumeric().withMessage(msg);
      case Validators.UUID:
        msg = message ? message : `Parameter "${name}" is not an UUID`;
        return valFunc.isUUID().withMessage(msg);
      default:
        msg = message ? message : `Parameter "${name}" is mandatory`;
        return valFunc.not().isEmpty().withMessage(msg);
    }
    msg = message ? message : `Parameter "${name}" is not from type ${type}`;
    return valFunc.withMessage(msg);
  }
}
