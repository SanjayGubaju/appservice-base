"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractstrategy_1 = require("./abstractstrategy");
class AbstractJwtStrategy extends abstractstrategy_1.AbstractStrategy {
    constructor(jwtService, whitelist) {
        super(whitelist);
        this.jwtService = jwtService;
    }
    async authenticateRequest(request, options) {
        const token = await this.jwtService.decodeTokenFromRequest(request.headers, request.body, request.query, true);
        return this.authenticateJwtRequest(token, request, options);
    }
}
exports.AbstractJwtStrategy = AbstractJwtStrategy;
