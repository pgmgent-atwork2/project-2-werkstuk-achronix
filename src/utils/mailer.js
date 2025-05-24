import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import Email from "../models/Email.js";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // testing
});

export const sendMail = async (to, subject, file, data) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, `../views/emails/${file}`);

  const html = await ejs.renderFile(templatePath, { data });

  try {
    if (await transporter.verify()) {
      return await transporter.sendMail({
        from: `"Pingpong club" <noreply@localhost>`,
        to,
        subject,
        html,
      });
    } else {
      return false;
    }
  } catch (error) {
    await Email.query().insert({
      email: to,
      subject,
      content: html,
      is_sent: false,
    });
    return false;
  }
};
