const { createTransport } = require('nodemailer');

async function sendEmail(to, subject, msg) {
  try {
    const transporter = createTransport({
      secure: false,
      port: 587,
      host: 'smtp.gmail.com',
      auth: {
        user: 'vaishvivek634@gmail.com',
        pass: 'eesvsnbpddtlzthk',
      },
      logger: true,
      debug: true,
    });
    const info = await transporter.sendMail({
      from: 'vaishvivek634@gmail.com',
      to,
      subject,
      html: msg,
    });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
sendEmail('vaish5617@gmail.com', 'test subject', 'text message');
