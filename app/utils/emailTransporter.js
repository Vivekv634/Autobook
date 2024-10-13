require('dotenv').config();
const { createTransport } = require('nodemailer');

export default async function sendEmail(to, subject, msg) {
  try {
    const transporter = createTransport({
      secure: false,
      port: 587,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL || 'vaishvivek634@gmail.com',
        pass: process.env.PASSWORD || 'eesvsnbpddtlzthk',
      },
      logger: true,
      debug: true,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL || 'vaishvivek634@gmail.com',
      to,
      subject,
      html: msg,
    });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
