import { SmtpData } from './smtpdata';
export declare class EMailService {
    private from;
    private defaultSubject;
    private static readonly DEFAULT_EMAIL_CONFIG;
    private transporter;
    /**
     *
     * @param from Sender of the email. Can be a simple email address or name and email like this:
     * @example
     * "Max Mustermann" <companyname@company.com>
     * @param defaultSubject
     * @param smtpData
     */
    constructor(from: string, defaultSubject: string, smtpData: SmtpData);
    private initSmtpServer;
    sendTextMail(text: string, to: string, subject?: string, from?: string): Promise<void>;
    sendHtmlMail(html: string, to: string, subject?: string, from?: string): Promise<void>;
    private sendMail;
    private createMailOptions;
}
