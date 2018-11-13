"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_decorator_1 = require("./internal/class.decorator");
// tslint:disable-next-line:function-name
function ROUTE(route) {
    return class_decorator_1.ClassDecorator.getDecoratorFunc(route);
}
exports.ROUTE = ROUTE;
