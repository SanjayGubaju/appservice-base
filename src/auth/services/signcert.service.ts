
export interface SignCertService {

  getPrivateCert(kid: string): Promise<string>;

  getPublicCert(kid: string): Promise<string>;

}
