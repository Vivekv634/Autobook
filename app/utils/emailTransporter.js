const { createTransport } = require('nodemailer');

const transporter = createTransport({
  secure: true,
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
});

export default function sendEmail(to, subject, msg) {
  transporter.sendMail({
    to,
    subject,
    html: msg,
  });
}
