import * as Transport from 'winston-transport';
interface WinstonFileTransportOptions extends Transport.TransportStreamOptions {
    fileName: string;
    maxSize?: number;
    maxFiles?: number;
    eol?: string;
}
export declare class WistonFileTransport extends Transport {
    static readonly defaultOptions: WinstonFileTransportOptions;
    private static readonly MESSAGE;
    private readonly options;
    private readonly maxMsgCount;
    private readonly eol;
    private msgCount;
    private msgBuffer;
    private fileDesc;
    private isWritable;
    private fileSize;
    private isDisabled;
    private isClosed;
    constructor(options: WinstonFileTransportOptions);
    private addCloseListener;
    private openLogFile;
    private getFileSize;
    private closeLogFile;
    log(info: any, next: () => void): any;
    logString(message: string): any;
    close(callback?: () => {}): void;
    private writeFile;
    private writeMsg;
}
export {};
