import { ValidationFunc } from './validationschema';

export class ValidationError implements Error {

  public readonly name: string = 'ValidationError';
  public readonly message: string;
  public readonly stack?: string | undefined;

  constructor(message: string) {
    this.message = message;
  }
}

export class Validator {

  constructor() { }

  public validate(validationFunc: ValidationFunc, query: any, body: any, params: any): { errors?: any } | undefined {
    const errors: any[] = [];
    for (const contentName of validationFunc.requestcontenttype) {
      const content = contentName === 'query' || {} ? query : contentName === 'body' || {} ? body : params || {};
      if (!validationFunc.validate(content)) {
        errors.concat(validationFunc.validate.errors);
      }
    }
    if (errors.length) {
      return { errors: errors.join(',') };
    }
  }

}
