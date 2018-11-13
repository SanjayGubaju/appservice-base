"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractcompatproxy_1 = require("../abstractcompatproxy");
class SimpleApplicationCompat extends abstractcompatproxy_1.AbstractCompatProxy {
    constructor(fastifyApplication) {
        super();
        this.fastifyApplication = fastifyApplication;
        this.props = new Map();
    }
    static getInstance(fastifyApplication) {
        return new SimpleApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION');
    }
    static getProxyInstance(fastifyApplication) {
        return new SimpleApplicationCompat(fastifyApplication).getCompatInstance('APPLICATION', true);
    }
    getBaseHttpClass() {
        return {};
    }
    set(name, value) {
        this.props.set(name, value);
        return this.app;
    }
    get(name) {
        return this.props.get(name);
    }
}
exports.SimpleApplicationCompat = SimpleApplicationCompat;
