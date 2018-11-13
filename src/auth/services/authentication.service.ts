import { debug } from 'console';

import { EMailService } from '../../email/email.service';
import { AuthUser, AuthUserModel } from '../models/authuser';
import { JwtService } from './jwt.service';
import { Configuration } from '../../config/config';

export class AuthenticationService {

  // TODO: emailservice as interface to allow different services
  constructor(private jwtService: JwtService,
              private emailService: EMailService) { }

  public async login(email: string, password: string): Promise<string | object> {
    try {
      const user: AuthUser = await AuthUserModel.findByEmail(email);
      if (user && user.isPasswordValid(password)) {
        return this.jwtService.createToken(user.getUUID());
      }
      throw ('Login failed');
    } catch (e) {
      debug(e);
      throw new Error('Internal server error');
    }
  }

  public async register(email: string, password: string): Promise<string | object> {
    let user: AuthUser | null = null;
    user = await AuthUserModel.findByEmail(email);
    if (user) {
      throw ('User with that email address already exists');
    }
    try {
      const userModel = {
        password,
        email: email.toLowerCase(),
      };
      user = await (await AuthUserModel.create(userModel)).save();
      if (!user) {
        throw ('Registration failed. Unable to add user.');
      }
      if (Configuration.getBoolean('AUTH_EMAIL_CONFIRMATION_REQUIRED')) {
        this.emailService.sendTextMail('Bitte Email bestätigen...', email);
      }
      return this.jwtService.createToken(user.getUUID());
    } catch (e) {
      debug(e);
      // TODO: use more meaningful message
      throw ('Unable to add new user');
    }
  }

  public async delete(email: string, password: string): Promise<void> {
    try {
      const user: AuthUser = await AuthUserModel.findByEmail(email);
      if (user && user.isPasswordValid(password)) {
        await AuthUserModel.findByIdAndRemove(user.getId());
        return;
      }
      throw ('Deletion of user failed');
    } catch (e) {
      debug(e);
      throw new Error('Internal server error');
    }
  }
}
