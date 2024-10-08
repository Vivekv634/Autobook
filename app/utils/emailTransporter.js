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
});

export default async function sendEmail(to, subject, msg) {
  try {
    const info = await transporter.sendMail({
      from: 'vaishvivek634@gmail.com', // Specify the "from" field
      to,
      subject,
      html: msg,
    });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
