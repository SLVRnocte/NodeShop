"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date = new Date();
function getUTCDateTime() {
    return date;
}
exports.getUTCDateTime = getUTCDateTime;
function dateToString(date) {
    return date.toUTCString();
}
exports.dateToString = dateToString;
function dateToLocaleString(date) {
    return date.toLocaleDateString();
}
exports.dateToLocaleString = dateToLocaleString;
//# sourceMappingURL=DateTime.js.map