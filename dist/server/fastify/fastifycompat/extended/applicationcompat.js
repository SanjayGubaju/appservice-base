"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simpleapplicationcompat_1 = require("../simple/simpleapplicationcompat");
class ApplicationCompat extends simpleapplicationcompat_1.SimpleApplicationCompat {
    static getInstance(fastifyApplication) {
        return new ApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION');
    }
    static getProxyInstance(fastifyApplication) {
        return new ApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION', true);
    }
}
exports.ApplicationCompat = ApplicationCompat;
