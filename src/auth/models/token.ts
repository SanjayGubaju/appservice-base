
export interface TokenData {
  readonly accesstoken: string;
  readonly kid: string;
  readonly expires: number;
  readonly payload: any;
  readonly header: any;
}

export class Token {

  constructor(private tokendata: TokenData) { }

  public getAccessToken(): string {
    return this.tokendata.accesstoken;
  }

  public getKid(): string {
    return this.tokendata.kid;
  }

  public getExpiration(): number {
    return this.tokendata.expires;
  }

  public getPayload(): any {
    return this.tokendata.payload;
  }

  public getHeader(): any {
    return this.tokendata.header;
  }

  public getUserId(): string {
    return this.tokendata.payload.sub;
  }

  // public getRealm(): string {
  //   return this.tokendata.payload.iss.split('/').pop();
  // }

  // public getClient(): string {
  //   return this.tokendata.payload.azp;
  // }
}
