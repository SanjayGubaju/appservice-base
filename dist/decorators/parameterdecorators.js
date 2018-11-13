"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameter_decorator_1 = require("./internal/parameter.decorator");
// @QUERYPARAM decorator
// tslint:disable-next-line:function-name
function QUERYPARAM(paramName, validation) {
    return parameter_decorator_1.ParameterDecorator.getDecoratorFunc(parameter_decorator_1.ParamType.QUERYPARAM, paramName, validation);
}
exports.QUERYPARAM = QUERYPARAM;
// @PATHPARAM decorator
// tslint:disable-next-line:function-name
function PATHPARAM(paramName, validation) {
    return parameter_decorator_1.ParameterDecorator.getDecoratorFunc(parameter_decorator_1.ParamType.PATHPARAM, paramName, validation);
}
exports.PATHPARAM = PATHPARAM;
// @REQUEST decorator
// tslint:disable-next-line:function-name
function REQUEST() {
    return parameter_decorator_1.ParameterDecorator.getDecoratorFunc(parameter_decorator_1.ParamType.REQUEST);
}
exports.REQUEST = REQUEST;
// @RESPONSE decorator
// tslint:disable-next-line:function-name
function RESPONSE() {
    return parameter_decorator_1.ParameterDecorator.getDecoratorFunc(parameter_decorator_1.ParamType.RESPONSE);
}
exports.RESPONSE = RESPONSE;
// @USER decorator
// tslint:disable-next-line:function-name
function USER() {
    return parameter_decorator_1.ParameterDecorator.getDecoratorFunc(parameter_decorator_1.ParamType.USER);
}
exports.USER = USER;
