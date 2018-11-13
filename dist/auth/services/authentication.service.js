"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const authuser_1 = require("../models/authuser");
const config_1 = require("../../config/config");
class AuthenticationService {
    // TODO: emailservice as interface to allow different services
    constructor(jwtService, emailService) {
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async login(email, password) {
        try {
            const user = await authuser_1.AuthUserModel.findByEmail(email);
            if (user && user.isPasswordValid(password)) {
                return this.jwtService.createToken(user.getUUID());
            }
            throw ('Login failed');
        }
        catch (e) {
            console_1.debug(e);
            throw new Error('Internal server error');
        }
    }
    async register(email, password) {
        let user = null;
        user = await authuser_1.AuthUserModel.findByEmail(email);
        if (user) {
            throw ('User with that email address already exists');
        }
        try {
            const userModel = {
                password,
                email: email.toLowerCase(),
            };
            user = await (await authuser_1.AuthUserModel.create(userModel)).save();
            if (!user) {
                throw ('Registration failed. Unable to add user.');
            }
            if (config_1.Configuration.getBoolean('AUTH_EMAIL_CONFIRMATION_REQUIRED')) {
                this.emailService.sendTextMail('Bitte Email bestätigen...', email);
            }
            return this.jwtService.createToken(user.getUUID());
        }
        catch (e) {
            console_1.debug(e);
            // TODO: use more meaningful message
            throw ('Unable to add new user');
        }
    }
    async delete(email, password) {
        try {
            const user = await authuser_1.AuthUserModel.findByEmail(email);
            if (user && user.isPasswordValid(password)) {
                await authuser_1.AuthUserModel.findByIdAndRemove(user.getId());
                return;
            }
            throw ('Deletion of user failed');
        }
        catch (e) {
            console_1.debug(e);
            throw new Error('Internal server error');
        }
    }
}
exports.AuthenticationService = AuthenticationService;
