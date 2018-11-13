"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const nodemailer_1 = require("nodemailer");
class EMailService {
    /**
     *
     * @param from Sender of the email. Can be a simple email address or name and email like this:
     * @example
     * "Max Mustermann" <companyname@company.com>
     * @param defaultSubject
     * @param smtpData
     */
    constructor(from, defaultSubject, smtpData) {
        this.from = from;
        this.defaultSubject = defaultSubject;
        const config = Object.assign({}, EMailService.DEFAULT_EMAIL_CONFIG, (smtpData || {}));
        this.transporter = this.initSmtpServer(config);
    }
    initSmtpServer(smtpData = { host: 'localhost', port: 587 }) {
        const auth = smtpData.password && smtpData.user
            ? { user: smtpData.user, pass: smtpData.password } : {};
        return nodemailer_1.createTransport({
            auth,
            host: smtpData.host || 'localhost',
            port: smtpData.port || smtpData.secure ? 465 : 587,
            secure: smtpData.secure || smtpData.port === 465,
        });
    }
    async sendTextMail(text, to, subject, from) {
        const mailOptions = this.createMailOptions(to, text, subject, from);
        this.sendMail(mailOptions);
    }
    async sendHtmlMail(html, to, subject, from) {
        const mailOptions = this.createMailOptions(to, html, subject, from, true);
        this.sendMail(mailOptions);
    }
    async sendMail(mailOptions) {
        try {
            const sentinfo = await this.transporter.sendMail(mailOptions);
            console_1.debug('Message sent: %s', sentinfo.messageId);
        }
        catch (e) {
            console_1.debug(e);
            throw new Error(e);
        }
    }
    createMailOptions(to, content, subject, from, isHtml = false) {
        return {
            to,
            from: from || this.from,
            subject: subject || this.defaultSubject,
            [isHtml ? 'html' : 'text']: content,
        };
    }
}
EMailService.DEFAULT_EMAIL_CONFIG = {
    host: 'localhost',
    port: 587,
    secure: false,
    ignoreTLS: true,
    requireTLS: false,
    tls: {},
};
exports.EMailService = EMailService;
