"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CookieHelper {
    constructor() {
        this.cookieValue = '';
    }
    getCookieValueByName(cookie, valueName) {
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
exports.CookieHelper = CookieHelper;
//# sourceMappingURL=cookieHelper.js.map