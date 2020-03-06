"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const invoicePath = path_1.default.join(__dirname, '..', 'data', 'invoices', '/');
exports.invoicePath = invoicePath;
const imagePath = path_1.default.join(__dirname, '..', 'data', 'images', '/');
exports.imagePath = imagePath;
const init = () => {
    if (!fs_1.default.existsSync(invoicePath)) {
        fs_1.default.mkdirSync(invoicePath);
    }
    if (!fs_1.default.existsSync(imagePath)) {
        fs_1.default.mkdirSync(imagePath);
    }
};
exports.init = init;
//# sourceMappingURL=fileStorage.js.map