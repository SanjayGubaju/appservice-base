"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const Transport = require("winston-transport");
const config_1 = require("../config/config");
const environment_1 = require("../config/environment");
const rotate = require('log-rotate');
class WistonFileTransport extends Transport {
    constructor(options) {
        super(options);
        this.msgCount = 1;
        this.msgBuffer = '';
        this.fileDesc = -1;
        this.isWritable = false;
        this.fileSize = 0;
        this.isDisabled = false;
        this.isClosed = false;
        this.options = Object.assign({}, WistonFileTransport.defaultOptions, options);
        this.eol = options.eol || os.EOL;
        this.maxMsgCount = config_1.Configuration.getEnvironment() === environment_1.Environment.Development ? 1 : 30;
        this.openLogFile(true);
        this.addCloseListener();
    }
    addCloseListener() {
        process.once('SIGINT', async () => {
            this.close();
        });
        process.once('SIGTERM', async () => {
            this.close();
        });
        process.once('SIGUSR2', async () => {
            if (!this.isClosed) {
                // this.close(() => { process.kill(process.pid, 'SIGUSR2'); return true; });
                this.close();
            }
        });
    }
    openLogFile(determineFileSize = false) {
        fs.open(this.options.fileName, 'a', (error, fileDesc) => {
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
    getFileSize() {
        const stats = fs.statSync(this.options.fileName);
        return stats['size'];
    }
    closeLogFile(callback = (error) => { }) {
        this.isWritable = false;
        fs.close(this.fileDesc, callback);
    }
    log(info, next) {
        this.writeMsg(info[WistonFileTransport.MESSAGE] + this.eol);
        next();
        return true;
    }
    logString(message) {
        this.writeMsg(message);
    }
    close(callback) {
        if (!this.isClosed) {
            this.isClosed = true;
            const cbFunc = callback || (() => { this.closeLogFile(() => { process.exitCode = 0; }); });
            this.writeFile(this.msgBuffer, cbFunc);
        }
    }
    writeFile(buffer, callback = () => { }) {
        this.isWritable = false;
        fs.write(this.fileDesc, buffer, null, null, () => {
            this.isWritable = true;
            callback();
        });
    }
    writeMsg(message) {
        if (this.isDisabled) {
            return;
        }
        if (this.fileSize > this.options.maxSize) {
            this.fileSize = 0;
            this.closeLogFile((error) => {
                if (!error) {
                    rotate(this.options.fileName, { count: this.options.maxFiles }, (error) => {
                        if (error) {
                            this.isDisabled = true;
                        }
                        this.openLogFile();
                    });
                }
                else {
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
        }
        else {
            this.msgCount += 1;
        }
    }
}
WistonFileTransport.defaultOptions = {
    fileName: 'application.log',
    maxSize: 1024 * 1024 * 10,
    maxFiles: 10,
};
WistonFileTransport.MESSAGE = Symbol.for('message');
exports.WistonFileTransport = WistonFileTransport;
