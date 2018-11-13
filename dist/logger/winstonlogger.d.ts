import { NextFunc } from '../server/types';
export declare class WinstonLogger {
    private static loggerWrapper;
    private static isDebugLevel;
    static init(): void;
    static getServerLogger(): (req: any, res: any, done: NextFunc) => {};
    static isDebug(): boolean;
}
