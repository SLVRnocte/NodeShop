import mailer from '@sendgrid/mail';

// Need this init function because app.ts has to initialize .env first
const init = () => {
  mailer.setApiKey(process.env.SENDGRIDAPIKEY!.toString());
  //   mailer = nodemailer.createTransport(
  //     sendgridTransport({
  //       auth: {
  //         api_key: process.env.SENDGRIDAPIKEY!.toString()
  //       }
  //     })
  //   );
};

export { mailer, init };
