"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// transport has no TS types
const sendgridTransport = require('nodemailer-sendgrid-transport');
let mailer;
exports.mailer = mailer;
// Need this init function because app.ts has to initialize .env first
const init = () => {
    exports.mailer = mailer = nodemailer_1.default.createTransport(sendgridTransport({
        auth: {
            api_key: process.env.SENDGRIDAPIKEY.toString()
        }
    }));
};
exports.init = init;
//# sourceMappingURL=mailer.js.map