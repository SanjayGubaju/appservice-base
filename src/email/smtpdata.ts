
export interface SmtpData {
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  password?: string;
  tls?: any;
  ignoreTLS?: boolean;
  requireTLS?: boolean;
}
