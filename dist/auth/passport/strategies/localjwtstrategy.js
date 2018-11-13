"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const authuser_1 = require("../../models/authuser");
const abstractjwtstrategy_1 = require("../abstractjwtstrategy");
class LocalJwtStrategy extends abstractjwtstrategy_1.AbstractJwtStrategy {
    getStrategyName() {
        return LocalJwtStrategy.STRATEGYNAME;
    }
    async authenticateJwtRequest(token, request, options) {
        const userid = token.getUserId();
        const user = await authuser_1.AuthUser.findByUUID(userid);
        console_1.debug('authenticateJwtRequest: user for id %s is %o', userid, user);
        if (!user) {
            throw new Error('Invalid user token');
        }
        return { user, token };
    }
}
LocalJwtStrategy.STRATEGYNAME = 'localauth';
exports.LocalJwtStrategy = LocalJwtStrategy;
