"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(tokendata) {
        this.tokendata = tokendata;
    }
    getAccessToken() {
        return this.tokendata.accesstoken;
    }
    getKid() {
        return this.tokendata.kid;
    }
    getExpiration() {
        return this.tokendata.expires;
    }
    getPayload() {
        return this.tokendata.payload;
    }
    getHeader() {
        return this.tokendata.header;
    }
    getUserId() {
        return this.tokendata.payload.sub;
    }
}
exports.Token = Token;
