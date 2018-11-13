import * as fs from 'fs';
import * as os from 'os';

import * as Transport from 'winston-transport';

import { Configuration } from '../config/config';
import { Environment } from '../config/environment';
import { info } from 'console';

const rotate = require('log-rotate');

interface WinstonFileTransportOptions extends Transport.TransportStreamOptions {
  fileName: string;
  maxSize?: number;
  maxFiles?: number;
  eol?: string;
}

export class WistonFileTransport extends Transport {

  public static readonly defaultOptions: WinstonFileTransportOptions = {
    fileName: 'application.log',
    maxSize: 1024 * 1024 * 10, // 10 MB,
    maxFiles: 10,
  };

  private static readonly MESSAGE = Symbol.for('message');

  private readonly options: WinstonFileTransportOptions;
  private readonly maxMsgCount: number;
  private readonly eol: string;

  private msgCount: number = 1;
  private msgBuffer: string = '';

  private fileDesc: number = -1;
  private isWritable: boolean = false;
  private fileSize: number = 0;
  private isDisabled: boolean = false;
  private isClosed: boolean = false;

  constructor(options: WinstonFileTransportOptions) {
    super(options);
    this.options = { ...WistonFileTransport.defaultOptions, ...options };
    this.eol = options.eol || os.EOL;
    this.maxMsgCount = Configuration.getEnvironment() === Environment.Development ? 1 : 30;
    this.openLogFile(true);
    this.addCloseListener();
  }

  private addCloseListener(): void {
    process.once('SIGINT', async (): Promise<void> => {
      this.close();
    });
    process.once('SIGTERM', async (): Promise<void> => {
      this.close();
    });
    process.once('SIGUSR2', async (): Promise<void> => {
      if (!this.isClosed) {
        // this.close(() => { process.kill(process.pid, 'SIGUSR2'); return true; });
        this.close();
      }
    });

  }

  private openLogFile(determineFileSize: boolean = false): void {
    fs.open(this.options.fileName, 'a', (error: Error, fileDesc: number) => {
      if (error) {
        throw error;
      }
      this.isWritable = true;
      this.fileDesc = fileDesc;
      if (determineFileSize) {
        this.fileSize += this.getFileSize();
      }
    });
  }

  private getFileSize(): number {
    const stats = fs.statSync(this.options.fileName);
    return stats['size'];
  }

  private closeLogFile(callback = (error: Error) => {}): void {
    this.isWritable = false;
    fs.close(this.fileDesc, callback);
  }

  public log(info: any, next: () => void): any {
    this.writeMsg(info[WistonFileTransport.MESSAGE] + this.eol);
    next();
    return true;
  }

  public logString(message: string): any {
    this.writeMsg(message);
  }

  public close(callback?: () => {}): void {
    if (!this.isClosed) {
      this.isClosed = true;
      const cbFunc = callback || (() => { this.closeLogFile(() => { process.exitCode = 0; }); });
      this.writeFile(this.msgBuffer, cbFunc);
    }
  }

  private writeFile(buffer: string, callback = () => {}): void {
    this.isWritable = false;
    fs.write(this.fileDesc, buffer, null, null, () => {
      this.isWritable = true;
      callback();
    });
  }

  private writeMsg(message: string): void {
    if (this.isDisabled) {
      return;
    }
    if (this.fileSize > this.options.maxSize!) {
      this.fileSize = 0;
      this.closeLogFile((error: Error) => {
        if (!error) {
          rotate(this.options.fileName, { count: this.options.maxFiles }, (error: Error) => {
            if (error) {
              this.isDisabled = true;
            }
            this.openLogFile();
          });
        } else {
          this.isDisabled = true;
        }
      });
    }
    this.msgBuffer += message;
    if (this.msgCount > this.maxMsgCount && this.isWritable) {
      this.msgCount = 1;
      const buffer = this.msgBuffer;
      this.fileSize += this.msgBuffer.length;
      this.msgBuffer = '';
      this.writeFile(buffer);
    } else {
      this.msgCount += 1;
    }
  }

}
