import { AuthenticationController } from './auth/controllers/auth.controller';
import { AuthenticationService, DefaultJwtService, JwtService } from './auth/exports';
import { LocalJwtStrategy } from './auth/passport/strategies/localjwtstrategy';
import { AuthenticationConfig } from './authentication.config';
import { Configuration } from './config/config';
import { Environment } from './config/environment';
import { MongoDbStarter } from './database/exports';
import { EMailService, SmtpData } from './email/exports';
import { WinstonLogger } from './logger/winstonlogger';
import { ExpressServer } from './server/express/expressserver';
import { FastifyServer } from './server/fastify/fastifyserver';
import { Server } from './server/server';

export class ServerApplication {

  private static readonly DEFAULT_EMAIL_CONFIG: SmtpData = {
    host: Configuration.get('EMAIL_HOST', 'localhost'),
    port: Configuration.getNumber('EMAIL_PORT', 587),
    user: Configuration.get('EMAIL_USER'),
    password: Configuration.get('EMAIL_PASSWORD'),
    secure: Configuration.getBoolean('EMAIL_SECURE'),
    ignoreTLS: Configuration.getBoolean('EMAIL_IGNORE_TLS'),
    requireTLS: Configuration.getBoolean('EMAIL_REQUIRE_TLS'),
    tls: Configuration.getObject('EMAIL_TLS'),
  };

  private server!: Server;
  private defaultJwtService: JwtService;
  private defaultEmailService: EMailService;
  private isAuthCtrlSet!: boolean;

  constructor() {
    WinstonLogger.init();
    if (Configuration.get('MONGODB_URI')) {
      new MongoDbStarter(Configuration.get('MONGODB_URI')).start();
    }
    this.defaultJwtService = new DefaultJwtService(Configuration.get('AUTH_JWT_PRIVATE_KEY'),
                                                   Configuration.get('AUTH_JWT_PUBLIC_KEY'));
    this.defaultEmailService = this.getEmailService();
  }

  public start(): void {
    this.server.startServer();
  }

  public getEmailService(from?: string, defaultSubject?: string, smtpData?: SmtpData): EMailService {
    const config: SmtpData = { ...ServerApplication.DEFAULT_EMAIL_CONFIG, ...(smtpData || {}) };
    const fromAddress = from || Configuration.get('EMAIL_FROM');
    const defSubject = defaultSubject || Configuration.get('EMAIL_SUBJECT') || 'EMail Information';
    return new EMailService(fromAddress, defSubject, config);
  }

  public getDefaultJwtService(): JwtService {
    return this.defaultJwtService;
  }

  public getDefaultEmailService(): JwtService {
    return this.defaultJwtService;
  }

  public getServer(port?: number, env?: string, corsServerUri?: string | string[]): Server {
    if (!this.server) {
      const serverport: number = port || Configuration.getNumber('SERVER_PORT', 3000);
      const environment: string = env || Configuration.getEnvironment() || Environment.Development;
      this.server = Configuration.getBoolean('USE_FASTIFY')
        ? new FastifyServer(serverport, environment, corsServerUri)
        : new ExpressServer(serverport, environment, corsServerUri);
    }
    return this.server;
  }

  public addAuthentication(authConfig: AuthenticationConfig): void {
    if (!authConfig.strategy) {
      this.server.addPassportStrategy(authConfig.path || '',
                                      new LocalJwtStrategy(this.defaultJwtService, authConfig.excludes));
    } else if (typeof authConfig.strategy === 'object') {
      this.server.addPassportStrategy(authConfig.path || '', authConfig.strategy);
    } else {
      const loginPath = authConfig.auth ? authConfig.auth.loginPath : null;
      const registrationPath = authConfig.auth ? authConfig.auth.registrationPath : null;
      this.server.addPassportStrategy(authConfig.path || '',
                                      new (<any>authConfig.strategy)(this.defaultJwtService,
                                                                     authConfig.excludes,
                                                                     loginPath,
                                                                     registrationPath));
    }

    if (authConfig.auth) {
      this.server.addController(authConfig.auth.controller);
    } else if (!this.isAuthCtrlSet) {

      this.server.addController(new AuthenticationController(
        new AuthenticationService(
          this.defaultJwtService,
          this.defaultEmailService)));
    }
  }
}
