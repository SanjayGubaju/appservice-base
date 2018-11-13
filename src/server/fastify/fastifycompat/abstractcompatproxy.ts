import { debug } from 'console';

export abstract class AbstractCompatProxy {

  protected abstract getBaseHttpClass(): any;

  protected getCompatInstance(type: string, useProxy: boolean = false): any {
    if (useProxy) {
      return this.getProxy(type);
    }
    return this;
  }

  protected getProxy<T>(type: string): T {
    const baseClass: any = this.getBaseHttpClass() as any;
    const proxyClassData: any = this as any;

    return new Proxy<any>(this, {
      get: (target: any, key: any) => {

        debug('(Proxy) %s::Get %s', type, key);

        const targetValue = proxyClassData[key];
        if (targetValue) {
          debug('(Proxy) %s::Found targetValue %s in proxyClass', type, key);
          if (typeof targetValue === 'function') {
            return (...args: any[]) => {
              return targetValue.apply(target, args);
            };
          }
          return targetValue;
        }

        const targetValue1 = proxyClassData[key];
        if (targetValue1) {
          debug('(Proxy) %s::Found targetValue %s in baseHttpClass', key);
          if (typeof targetValue1 === 'function') {
            return (...args: any[]) => {
              return targetValue1.apply(baseClass.req, args);
            };
          }
          return targetValue1;
        }

      },
      set(target: Response, key: any, value: any): boolean {
        debug('(Proxy) %s::Set %s', key);
        proxyClassData[key] = value;
        baseClass[key] = value;
        return true;
      },
    });
  }
}
