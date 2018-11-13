import { AuthenticationService } from '../services/authentication.service';
export declare class AuthenticationController {
    private authenticationService;
    constructor(authenticationService: AuthenticationService);
    register(email: string, password: string): Promise<any>;
    loginUser(email: string, password: string): Promise<string | object>;
    deleteAccount(email: string, password: string): Promise<void>;
}
