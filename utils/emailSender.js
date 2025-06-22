// utils/emailSender.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"QualityPics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

const sendEmailtoAdmin = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"QualityPics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = { sendEmail, sendEmailtoAdmin };
