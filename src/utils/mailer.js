import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // testing
});

export const sendMail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"Pingpong club" <noreply@localhost>`,
    to,
    subject,
    html,
  });
};
