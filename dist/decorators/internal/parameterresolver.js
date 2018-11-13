"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestutil_1 = require("../../util/requestutil");
const parameter_decorator_1 = require("./parameter.decorator");
class ParameterResolver {
    constructor() { }
    static resolveParams(request, response, controllerClass, methodName) {
        const paramDescriptors = ParameterResolver.getParams(controllerClass, methodName);
        const parameters = [...Array(paramDescriptors.length)];
        for (const descriptor of paramDescriptors) {
            switch (descriptor.paramtype) {
                case parameter_decorator_1.ParamType.QUERYPARAM:
                    parameters[descriptor.index] = requestutil_1.RequestUtil.getParameter(descriptor.name || '', request);
                    break;
                case parameter_decorator_1.ParamType.PATHPARAM:
                    parameters[descriptor.index] = requestutil_1.RequestUtil.getPathParameter(descriptor.name || '', request);
                    break;
                case parameter_decorator_1.ParamType.REQUEST:
                    parameters[descriptor.index] = request;
                    break;
                case parameter_decorator_1.ParamType.RESPONSE:
                    parameters[descriptor.index] = response;
                    break;
                case parameter_decorator_1.ParamType.USER:
                    parameters[descriptor.index] = request.user || {};
                    break;
            }
        }
        return parameters;
    }
    static getParams(controllerClass, methodName) {
        if (controllerClass[parameter_decorator_1.ParameterDecorator.PARAMETERMETADATA]
            && controllerClass[parameter_decorator_1.ParameterDecorator.PARAMETERMETADATA][methodName]) {
            return controllerClass[parameter_decorator_1.ParameterDecorator.PARAMETERMETADATA][methodName];
        }
        return [];
    }
}
exports.ParameterResolver = ParameterResolver;
