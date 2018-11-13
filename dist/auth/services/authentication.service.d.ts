import { EMailService } from '../../email/email.service';
import { JwtService } from './jwt.service';
export declare class AuthenticationService {
    private jwtService;
    private emailService;
    constructor(jwtService: JwtService, emailService: EMailService);
    login(email: string, password: string): Promise<string | object>;
    register(email: string, password: string): Promise<string | object>;
    delete(email: string, password: string): Promise<void>;
}
