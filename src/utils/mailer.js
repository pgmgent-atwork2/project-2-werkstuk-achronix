import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // testing
});

export const sendMail = async (to, subject, html) => {
  try {
    return await transporter.sendMail({
      from: `"Pingpong club" <noreply@localhost>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};
