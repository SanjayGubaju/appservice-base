"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const method_decorator_1 = require("./internal/method.decorator");
// tslint:disable-next-line:function-name
function GET(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'get', options);
}
exports.GET = GET;
// tslint:disable-next-line:function-name
function POST(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'post', options);
}
exports.POST = POST;
// tslint:disable-next-line:function-name
function PUT(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'put', options);
}
exports.PUT = PUT;
// tslint:disable-next-line:function-name
function DELETE(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'delete', options);
}
exports.DELETE = DELETE;
// tslint:disable-next-line:function-name
function HEAD(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'head', options);
}
exports.HEAD = HEAD;
// tslint:disable-next-line:function-name
function TRACE(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'trace', options);
}
exports.TRACE = TRACE;
// tslint:disable-next-line:function-name
function OPTIONS(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'options', options);
}
exports.OPTIONS = OPTIONS;
// tslint:disable-next-line:function-name
function CONNECT(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'connect', options);
}
exports.CONNECT = CONNECT;
// tslint:disable-next-line:function-name
function PATCH(route, options) {
    return method_decorator_1.MethodDecorator.getDecoratorFunc(route, 'patch', options);
}
exports.PATCH = PATCH;
