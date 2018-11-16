import * as ajv from 'ajv';

import { AjvInstance } from './ajvinstance';

export enum RequestContentType {
  QUERY = 'query',
  PARAMS = 'params',
  BODY = 'body',
}

export interface ValidationFunc {
  requestcontenttype: string[];
  validate: ajv.ValidateFunction;
}

export class ValidationSchema {

  private ajv: ajv.Ajv;

  // query, params or body
  private readonly requestContentTypes: string[];
  private isRequired: boolean = false;
  private fieldName!: string;
  private format!: string;

  private constructor(name: string) {
    this.ajv = AjvInstance.getInstance();
    this.fieldName = name;
    this.requestContentTypes = [];
  }

  public static check(name: string): ValidationSchema {
    return new ValidationSchema(name);
  }

  public useRequestContent(...requestContentNames: RequestContentType[]): ValidationSchema {
    for (const requestContentName of requestContentNames) {
      this.requestContentTypes.push(requestContentName);
    }
    this.requestContentTypes.concat([...requestContentNames]);
    return this;
  }

  public getValidationFunc(): ValidationFunc {
    const schema: any = {
      type: 'object',
      properties: {

      },
    };
    if (this.isRequired) {
      schema.required = [this.fieldName];
      schema.properties[this.fieldName] = {
        type: 'string',
        format: this.format,
      };
    }
    return {
      requestcontenttype: this.requestContentTypes,
      validate: this.ajv.compile(schema),
    };
  }

  public required(): ValidationSchema {
    this.isRequired = true;
    return this;
  }

  public isAlpha(): ValidationSchema {
    this.format = 'alpha';
    return this;
  }

  public isAlphanumeric(): ValidationSchema {
    this.format = 'alphanumeric';
    return this;
  }

  public isAscii(): ValidationSchema {
    this.format = 'ascii';
    return this;
  }

  public isBase64(): ValidationSchema {
    this.format = 'base64';
    return this;
  }

  public isBefore(beforeDate?: string): ValidationSchema {
    throw('Not implemented yet');
  }

  public isBoolean(): ValidationSchema {
    this.format = 'boolean';
    return this;
  }

  public isDate(): ValidationSchema {
    this.format = 'date';
    return this;
  }

  public isDecimal(): ValidationSchema {
    this.format = 'decimal';
    return this;
  }

  public isEmail(): ValidationSchema {
    this.format = 'email';
    return this;
  }

  public isIBAN(): ValidationSchema {
    this.format = 'iban';
    return this;
  }

  public isISO8601(): ValidationSchema {
    this.format = 'date';
    return this;
  }

  public isJSON(): ValidationSchema {
    this.format = 'json';
    return this;
  }

  public isNumeric(): ValidationSchema {
    this.format = 'numeric';
    return this;
  }

  public isUUID(): ValidationSchema {
    this.format = 'uuid';
    return this;
  }

  public isEmpty(): ValidationSchema {
    this.format = 'empty';
    return this;
  }

  public isNotEmpty(): ValidationSchema {
    this.format = 'notempty';
    return this;
  }

  public isCustom(format: (value: any) => boolean): ValidationSchema {
    const name = `custom-${new Date().getTime()}`;
    AjvInstance.addCustomFormat(name, format);
    this.format = name;
    return this;
  }

  public withMessage(message: string): ValidationSchema {
    // TODO: add custom message
    return this;
  }

}
