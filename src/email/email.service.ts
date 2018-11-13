import { debug } from 'console';

import { SendMailOptions, SentMessageInfo, Transporter, createTransport } from 'nodemailer';

import { SmtpData } from './smtpdata';

export class EMailService {

  private static readonly DEFAULT_EMAIL_CONFIG: SmtpData = {
    host: 'localhost',
    port: 587,
    secure: false,
    ignoreTLS: true,
    requireTLS: false,
    tls: {},
  };

  private transporter: Transporter;

   /**
    *
    * @param from Sender of the email. Can be a simple email address or name and email like this:
    * @example
    * "Max Mustermann" <companyname@company.com>
    * @param defaultSubject
    * @param smtpData
    */
  constructor(private from: string, private defaultSubject: string, smtpData: SmtpData) {
    const config: SmtpData = { ...EMailService.DEFAULT_EMAIL_CONFIG, ...(smtpData || {}) };
    this.transporter = this.initSmtpServer(config);
  }

  private initSmtpServer(smtpData: SmtpData = { host: 'localhost', port: 587 }): Transporter {
    const auth = smtpData.password && smtpData.user
        ? { user: smtpData.user, pass: smtpData.password } : {};

    return createTransport({
      auth,
      host: smtpData.host || 'localhost',
      port: smtpData.port || smtpData.secure ? 465 : 587,
      secure: smtpData.secure || smtpData.port === 465,
    });
  }

  public async sendTextMail(text: string, to: string, subject?: string, from?: string): Promise<void> {
    const mailOptions: SendMailOptions = this.createMailOptions(to, text, subject, from);
    this.sendMail(mailOptions);
  }

  public async sendHtmlMail(html: string, to: string, subject?: string, from?: string): Promise<void> {
    const mailOptions: SendMailOptions = this.createMailOptions(to, html, subject, from, true);
    this.sendMail(mailOptions);
  }

  private async sendMail(mailOptions: SendMailOptions): Promise<void> {
    try {
      const sentinfo: SentMessageInfo = await this.transporter.sendMail(mailOptions);
      debug('Message sent: %s', sentinfo.messageId);
    } catch (e) {
      debug(e);
      throw new Error(e);
    }
  }

  private createMailOptions(to: string, content: string, subject?: string, from?: string, isHtml: boolean = false) {
    return {
      to,
      from: from || this.from,
      subject: subject || this.defaultSubject,
      [isHtml ? 'html' : 'text']: content,
    };
  }
}
