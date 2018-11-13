
export enum Type {
  Array = 'array',
  Boolean = 'boolean',
  Date = 'date',
  Error = 'error',
  Function = 'function',
  JsonString = 'jsonstring',
  Number = 'number',
  Object = 'object',
  RegExp = 'regexp',
  String = 'string',
  Undefined = 'undefined',
  Unknown = 'unknown',
}

export class DataType {

  public static getType(value: any): Type {
    if (DataType.isUndefined(value)) {
      return Type.Undefined;
    }
    if (DataType.isJsonString(value)) {
      return Type.JsonString;
    }
    if (DataType.isString(value)) {
      return Type.String;
    }
    if (DataType.isObject(value)) {
      return Type.Object;
    }
    if (DataType.isNumber(value)) {
      return Type.Number;
    }
    if (DataType.isArray(value)) {
      return Type.Array;
    }
    if (DataType.isBoolean(value)) {
      return Type.Boolean;
    }
    if (DataType.isDate(value)) {
      return Type.Date;
    }
    if (DataType.isError(value)) {
      return Type.Error;
    }
    if (DataType.isFunction(value)) {
      return Type.Function;
    }
    if (DataType.isRegExp(value)) {
      return Type.RegExp;
    }
    return Type.Unknown;
  }

  public static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public static isBoolean(value: any): boolean {
    return typeof value === 'boolean' || value instanceof Boolean;
  }

  public static isDate(value: any): boolean {
    return value instanceof Date;
  }

  public static isError(value: any): boolean {
    return value instanceof Error && typeof value.message !== 'undefined';
  }

  public static isFunction(value: any): boolean {
    return typeof value === 'function';
  }

  public static isJsonString(value: any): boolean {
    try {
      return DataType.isString(value) && JSON.parse(value);
    } catch (e) { }
    return false;
  }

  public static isNumber(value: any): boolean {
    return Number.isFinite(value);
  }

  public static isObject(value: any): boolean {
    return value && typeof value === 'object' && (value.constructor === Object
    || (!DataType.isArray(value) && !DataType.isRegExp(value)
      && !DataType.isUndefined(value) && !DataType.isDate(value)
        && !DataType.isNumber(value) && !DataType.isError(value)));
  }

  public static isRegExp(value: any): boolean {
    return value && typeof value === 'object' && value.constructor === RegExp;
  }

  public static isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  public static isUndefined(value: any): boolean {
    return value === null || typeof value === 'undefined';
  }

}
