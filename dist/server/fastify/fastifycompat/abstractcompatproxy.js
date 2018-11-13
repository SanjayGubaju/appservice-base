"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
class AbstractCompatProxy {
    getCompatInstance(type, useProxy = false) {
        if (useProxy) {
            return this.getProxy(type);
        }
        return this;
    }
    getProxy(type) {
        const baseClass = this.getBaseHttpClass();
        const proxyClassData = this;
        return new Proxy(this, {
            get: (target, key) => {
                console_1.debug('(Proxy) %s::Get %s', type, key);
                const targetValue = proxyClassData[key];
                if (targetValue) {
                    console_1.debug('(Proxy) %s::Found targetValue %s in proxyClass', type, key);
                    if (typeof targetValue === 'function') {
                        return (...args) => {
                            return targetValue.apply(target, args);
                        };
                    }
                    return targetValue;
                }
                const targetValue1 = proxyClassData[key];
                if (targetValue1) {
                    console_1.debug('(Proxy) %s::Found targetValue %s in baseHttpClass', key);
                    if (typeof targetValue1 === 'function') {
                        return (...args) => {
                            return targetValue1.apply(baseClass.req, args);
                        };
                    }
                    return targetValue1;
                }
            },
            set(target, key, value) {
                console_1.debug('(Proxy) %s::Set %s', key);
                proxyClassData[key] = value;
                baseClass[key] = value;
                return true;
            },
        });
    }
}
exports.AbstractCompatProxy = AbstractCompatProxy;
