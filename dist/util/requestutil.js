"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestUtil {
    constructor() { }
    static getParameter(name, request) {
        return request.body[name] || request.query[name];
    }
    static getPathParameter(name, request) {
        return request.params[name];
    }
}
exports.RequestUtil = RequestUtil;
