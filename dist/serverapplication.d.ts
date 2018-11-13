import { JwtService } from './auth/exports';
import { AuthenticationConfig } from './authentication.config';
import { EMailService, SmtpData } from './email/exports';
import { Server } from './server/server';
export declare class ServerApplication {
    private static readonly DEFAULT_EMAIL_CONFIG;
    private server;
    private defaultJwtService;
    private defaultEmailService;
    private isAuthCtrlSet;
    constructor();
    start(): void;
    getEmailService(from?: string, defaultSubject?: string, smtpData?: SmtpData): EMailService;
    getDefaultJwtService(): JwtService;
    getDefaultEmailService(): JwtService;
    getServer(port?: number, env?: string, corsServerUri?: string | string[]): Server;
    addAuthentication(authConfig: AuthenticationConfig): void;
}
