const nodemailer = require("nodemailer");
console.log("EMAIL_HOST :", process.env.EMAIL_HOST);
console.log("EMAIL_PORT :", process.env.EMAIL_PORT);
console.log("EMAIL_USER :", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASSWORD présente :",
  !!process.env.EMAIL_PASSWORD
);
console.log(
  "EMAIL_FROM :",
  process.env.EMAIL_FROM
);
const transporter = nodemailer.createTransport({
  
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
  
});

module.exports = transporter;