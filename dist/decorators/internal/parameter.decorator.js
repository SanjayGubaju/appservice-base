"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_decorator_1 = require("./class.decorator");
var ParamType;
(function (ParamType) {
    ParamType["QUERYPARAM"] = "queryparam";
    ParamType["PATHPARAM"] = "pathparam";
    ParamType["REQUEST"] = "request";
    ParamType["RESPONSE"] = "response";
    ParamType["USER"] = "user";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
class ParameterDecorator {
    static getDecoratorFunc(paramType, paramName, validation) {
        return (controllerClass, methodName, index) => {
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
    static initTargetObject(paramType, controllerClass, methodName) {
        if (!controllerClass[ParameterDecorator.PARAMETERMETADATA]) {
            controllerClass[ParameterDecorator.PARAMETERMETADATA] = [];
        }
        if (!controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName]) {
            controllerClass[ParameterDecorator.PARAMETERMETADATA][methodName] = [];
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
    static createKey(paramType, controllerClass, methodName) {
        const classHash = class_decorator_1.ClassDecorator.getHash(controllerClass);
        return `${paramType}@${classHash}@${methodName}`;
    }
}
ParameterDecorator.PARAMETERMETADATA = 'parametermetadata';
exports.ParameterDecorator = ParameterDecorator;
