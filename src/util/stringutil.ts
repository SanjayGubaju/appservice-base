
export class StringUtil {

  private constructor() { }

  public static hashCode(text: string): number {
    if (text.length === 0) {
      return 0;
    }
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * see: https://bloomlab.blogspot.com/2018/06/typescript-recipe-elegant-parse-boolean.html
   *
   * @static
   * @returns {{}
   * @memberof StringUtil
   */
  public static toBoolean(value?: string | number | boolean | null): boolean {
    if (value === 'true') {
      return true;
    }

    return typeof value === 'string'
        ? !!+value   // we parse string to number first
        : !!value;
  }

}
