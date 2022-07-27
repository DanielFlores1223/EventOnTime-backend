const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.DEV_MAIL_HOST,
    port: process.env.DEV_MAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.DEV_MAIL_AUTH_USER,
      pass: process.env.DEV_MAIL_AUTH_PASSWORD,
    },
  });

  transporter.verify().then(() => {
      console.log('Ready for send emails')
  }).catch(err => { console.log(err); console.log(process.env.DEV_MAIL_AUTH_USER) })

module.exports = { transporter }