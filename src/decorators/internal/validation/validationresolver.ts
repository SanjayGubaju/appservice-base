import * as stringify from 'safe-stable-stringify';

import { NextFunc } from '../../../server/types';
import { AjvInstance } from '../../../validation/ajvinstance';
import { RequestContentType, ValidationFunc, ValidationSchema } from '../../../validation/validationschema';
import { Validation, Validators } from '../../../validation/validators';
import { ParamDescriptor, ParamType } from '../parameter.decorator';
import { ParameterResolver } from '../parameterresolver';

export class AjvValidationResolver {

  private constructor() { }

  public static getValidationFunction(controllerClass: any,
                                      methodName: string,
                                      validationchain?: any): (request: any, response: any, done: NextFunc) => void {
    // const validators: ValidationFunc[] = validationchain ? validationchain : [];
    const validators: ValidationFunc[] = AjvValidationResolver.applyValidators(controllerClass, methodName);
    return (request: any, response: any, done: any) => {
      let errors: any[] = [];
      let contentParams: any;
      let contentQueryBody: any;
      let content: any;
      let length = validators.length;

      // tslint:disable-next-line:no-increment-decrement
      while (length--) {
        const validator = validators[length];
        // check params
        if (validator.requestcontenttype.length === 1) {
          content = contentParams = contentParams ? contentParams
            : AjvValidationResolver.getContents(validator.requestcontenttype, request);
        } else { // check query and body
          content = contentQueryBody = contentQueryBody ? contentQueryBody
            : AjvValidationResolver.getContents(validator.requestcontenttype, request);
        }
        if (!validator.validate(content)) {
          errors = errors.concat(validator.validate.errors);
        }
      }

      if (errors.length) {
        const errorMsg = { errors: Object.assign.apply(null, errors) };
        // Fastify
        if (request['raw']) {
          response.serializer((payload: any) => stringify.default(payload));
          response.type('application/json; charset=utf-8').status(400);
          done(errorMsg);
        } else { // express
          response.type('application/json; charset=utf-8').status(400).send(errorMsg);
        }
      } else {
        done();
      }
    };
  }

  private static applyValidators(controllerClass: any,
                                 methodName: string): ValidationFunc[] {
    const validationFunctions: ValidationFunc[] = [];
    const parameters: ParamDescriptor[] = ParameterResolver.getParams(controllerClass, methodName);

    // TODO: consider validationchain
    for (const parameter of parameters) {
      if (parameter.name && parameter.validation) {
        const valSchema = ValidationSchema.check(parameter.name);
        if (parameter.paramtype === ParamType.PATHPARAM) {
          valSchema.useRequestContent(RequestContentType.PARAMS);
        } else {
          valSchema.useRequestContent(RequestContentType.QUERY, RequestContentType.BODY);
        }
        // add correct type to check e.g. check().isEmail()
        this.addValidationFunc(parameter.validation, parameter.name, valSchema);
        validationFunctions.push(valSchema.getValidationFunc());
      }
    }
    return validationFunctions;
  }

  private static getContents(contentTypes: string[], request: any): any {
    if (contentTypes.length === 1) {
      return request[contentTypes[0]];
    }
    let merged = {};
    for (const contentType of contentTypes) {
      merged = { ...merged, ...(<any>request)[contentType] };
    }
    return merged;
  }

  private static addValidationFunc(paramValidation: Validation,
                                   name: string,
                                   validationFunc: ValidationSchema,
                                   message?: string): ValidationSchema {
    let valFunc = paramValidation.required ? validationFunc.required() : validationFunc;
    let type: string;
    let msg;
    if (paramValidation.custom) {
      msg = message ? message : `Parameter ${name} is not valid`;
      valFunc = valFunc.isCustom(paramValidation.custom);
      return valFunc.withMessage(msg);
    }
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
      case Validators.Float:
        type = 'decimal';
        valFunc = valFunc.isDecimal();
        break;
      case Validators.Email:
        msg = message ? message : `Parameter "${name}" is not a valid email address`;
        return valFunc.isEmail().withMessage(msg);
      case Validators.ISO8601:
        type = 'ISO8601';
        valFunc = valFunc.isISO8601();
        break;
      case Validators.IBAN:
        type = 'IBAN';
        valFunc = valFunc.isIBAN();
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
        msg = message ? message : `Parameter "${name}" must not be empty`;
        return valFunc.isNotEmpty().withMessage(msg);
    }

    msg = msg ? msg : `Parameter "${name}" is not from type ${type}`;
    return valFunc.withMessage(msg);
  }
}
