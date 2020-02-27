"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
exports.mailer = mail_1.default;
// Need this init function because app.ts has to initialize .env first
const init = () => {
    mail_1.default.setApiKey(process.env.SENDGRIDAPIKEY.toString());
    //   mailer = nodemailer.createTransport(
    //     sendgridTransport({
    //       auth: {
    //         api_key: process.env.SENDGRIDAPIKEY!.toString()
    //       }
    //     })
    //   );
};
exports.init = init;
//# sourceMappingURL=mailer.js.map