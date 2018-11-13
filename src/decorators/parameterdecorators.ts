import { ParamType, ParameterDecorator } from './internal/parameter.decorator';
import { Validation } from '../validation/validators';

// @QUERYPARAM decorator
// tslint:disable-next-line:function-name
export function QUERYPARAM(paramName: string, validation?: Validation) {
  return ParameterDecorator.getDecoratorFunc(ParamType.QUERYPARAM, paramName, validation);
}

// @PATHPARAM decorator
// tslint:disable-next-line:function-name
export function PATHPARAM(paramName: string, validation?: Validation) {
  return ParameterDecorator.getDecoratorFunc(ParamType.PATHPARAM, paramName, validation);
}

// @REQUEST decorator
// tslint:disable-next-line:function-name
export function REQUEST() {
  return ParameterDecorator.getDecoratorFunc(ParamType.REQUEST);
}

// @RESPONSE decorator
// tslint:disable-next-line:function-name
export function RESPONSE() {
  return ParameterDecorator.getDecoratorFunc(ParamType.RESPONSE);
}

// @USER decorator
// tslint:disable-next-line:function-name
export function USER() {
  return ParameterDecorator.getDecoratorFunc(ParamType.USER);
}
