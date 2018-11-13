import { Configuration } from '../../config/config';
import { POST, DELETE } from '../../decorators/methoddecorators';
import { QUERYPARAM } from '../../decorators/parameterdecorators';
import { Validator_EmailRequired, Validator_Required } from '../../decorators/validators';
import { AuthenticationService } from '../services/authentication.service';

export class AuthenticationController {

  constructor(private authenticationService: AuthenticationService) { }

  @POST(Configuration.get('REGISTRATION_ENDPOINT') || '/register', {
    success: 201,
    error: 409,
  })
  public async register(@QUERYPARAM('email', Validator_EmailRequired) email: string,
                        @QUERYPARAM('password', Validator_Required) password: string): Promise<any> {
    return this.authenticationService.register(email, password);
  }

  @POST(Configuration.get('LOGIN_ENDPOINT') || '/login', {
    error: 401,
  })
  public async loginUser(@QUERYPARAM('email', Validator_EmailRequired) email: string,
                         @QUERYPARAM('password', Validator_Required) password: string): Promise<string | object> {
    return this.authenticationService.login(email, password);
  }

  @DELETE(Configuration.get('DELETE_ACCOUNT_ENDPOINT') || '/deleteaccount')
  public async deleteAccount(@QUERYPARAM('email', Validator_EmailRequired) email: string,
                             @QUERYPARAM('password', Validator_Required) password: string): Promise<void> {
    this.authenticationService.delete(email, password);
  }

}
