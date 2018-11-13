"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config/config");
const methoddecorators_1 = require("../../decorators/methoddecorators");
const parameterdecorators_1 = require("../../decorators/parameterdecorators");
const validators_1 = require("../../decorators/validators");
class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async register(email, password) {
        return this.authenticationService.register(email, password);
    }
    async loginUser(email, password) {
        return this.authenticationService.login(email, password);
    }
    async deleteAccount(email, password) {
        this.authenticationService.delete(email, password);
    }
}
__decorate([
    methoddecorators_1.POST(config_1.Configuration.get('REGISTRATION_ENDPOINT') || '/register', {
        success: 201,
        error: 409,
    }),
    __param(0, parameterdecorators_1.QUERYPARAM('email', validators_1.Validator_EmailRequired)),
    __param(1, parameterdecorators_1.QUERYPARAM('password', validators_1.Validator_Required)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    methoddecorators_1.POST(config_1.Configuration.get('LOGIN_ENDPOINT') || '/login', {
        error: 401,
    }),
    __param(0, parameterdecorators_1.QUERYPARAM('email', validators_1.Validator_EmailRequired)),
    __param(1, parameterdecorators_1.QUERYPARAM('password', validators_1.Validator_Required)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "loginUser", null);
__decorate([
    methoddecorators_1.DELETE(config_1.Configuration.get('DELETE_ACCOUNT_ENDPOINT') || '/deleteaccount'),
    __param(0, parameterdecorators_1.QUERYPARAM('email', validators_1.Validator_EmailRequired)),
    __param(1, parameterdecorators_1.QUERYPARAM('password', validators_1.Validator_Required)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "deleteAccount", null);
exports.AuthenticationController = AuthenticationController;
