import { Environment } from './environment';
export declare class Configuration {
    private static isInit;
    private static environment;
    static getEnvironment(): Environment;
    static get(name: string, defaultValue?: string): string;
    static getBoolean(name: string, defaultValue?: boolean): boolean;
    static getNumber(name: string, defaultValue: number): number;
    static getObject(name: string, defaultValue?: {}): any;
    static getArray(name: string, defaultArray?: never[]): string[];
    static init(): void;
    private static initEnvironment;
    private static getRawValue;
}
