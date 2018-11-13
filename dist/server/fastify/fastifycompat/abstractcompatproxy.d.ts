export declare abstract class AbstractCompatProxy {
    protected abstract getBaseHttpClass(): any;
    protected getCompatInstance(type: string, useProxy?: boolean): any;
    protected getProxy<T>(type: string): T;
}
