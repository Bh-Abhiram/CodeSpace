// server/utils/sendVerificationMail.js
const nodemailer = require("nodemailer");

const sendVerificationMail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"CodeSpace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to CodeSpace!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
    `,
  });
};

module.exports = sendVerificationMail;
