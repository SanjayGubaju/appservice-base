export declare class MongoDbStarter {
    private uri;
    constructor(uri: string);
    start(): void;
    private initShutdownListener;
    private close;
}
