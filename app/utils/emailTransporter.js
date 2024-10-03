const { createTransport } = require('nodemailer');

const transporter = createTransport({
  secure: true,
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'vaish5617@gmail.com',
    pass: 'cfcl xavc ntnn rlat',
  },
});

export default function sendEmail(to, subject, msg) {
  transporter.sendMail({
    to,
    subject,
    html: msg,
  });
}
