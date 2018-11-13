export interface TokenData {
    readonly accesstoken: string;
    readonly kid: string;
    readonly expires: number;
    readonly payload: any;
    readonly header: any;
}
export declare class Token {
    private tokendata;
    constructor(tokendata: TokenData);
    getAccessToken(): string;
    getKid(): string;
    getExpiration(): number;
    getPayload(): any;
    getHeader(): any;
    getUserId(): string;
}
