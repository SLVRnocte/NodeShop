export class CookieHelper {
  private cookieValue: string = '';

  getCookieValueByName(cookie: string, valueName: string) {
    //if (cookie === undefined) return this;

    const pattern = RegExp(valueName + '=.[^;]*');
    let matched = cookie.match(pattern);
    if (matched) {
      this.cookieValue = matched[0].split('=')[1];
    }
    return this;
  }

  toString() {
    return this.cookieValue;
  }

  toBool() {
    return this.cookieValue === 'true';
  }
}
