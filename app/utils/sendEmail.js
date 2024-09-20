const nodemailer = require('nodemailer');

export async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vaishvivek634@gmail.com',
      pass: 'Arduino@1',
    },
  });
  const mailOptions = {
    from: 'vaishvivek634@gmail.com',
    to: 'vaishvivek633@gmail.com',
    text: 'hello world',
    subject: 'this is subject',
  };
  await transporter.sendEmail(mailOptions, (error, info) => {
    console.log(info);
    if (error) {
      throw new Error(error);
    } else {
      console.log('Email Sent');
      return true;
    }
  });
}
