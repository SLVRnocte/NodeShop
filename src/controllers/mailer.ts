import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
// transport has no TS types
const sendgridTransport = require('nodemailer-sendgrid-transport');

let mailer: Mail;

// Need this init function because app.ts has to initialize .env first
const init = () => {
  mailer = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRIDAPIKEY!.toString()
      }
    })
  );
};

export { mailer, init };
