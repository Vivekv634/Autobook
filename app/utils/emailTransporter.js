const { createTransport } = require('nodemailer');

const transporter = createTransport({
  secure: true,
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'vaishvivek634@gmail.com',
    pass: 'eesvsnbpddtlzthk',
  },
  logger: true,
  debug: true,
  headers: {
    'X-Priority': '1',
    'X-MSMail-Priority': 'High',
    Importance: 'High',
  },
});

export default function sendEmail(to, subject, msg) {
  try {
    transporter.sendMail({
      to,
      subject,
      html: msg,
    });
    console.log(`email sent to the ${to}`);
  } catch (error) {
    console.error(error);
  }
}
