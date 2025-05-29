import Email from "../models/Email.js";
import { transporter } from "../utils/mailer.js";

async function sendUnsentEmails() {
  return await Email.query()
    .where({ is_sent: false })
    .then((emails) => {
      if (emails.length === 0) {
        return;
      }

      emails.forEach(async (email) => {
        await transporter.sendMail({
          from: `"Pingpong club" <noreply@localhost>`,
          to: email.email,
          subject: email.subject,
          html: email.content,
        });
        return Email.query().update({
          email: email.email,
          subject: email.subject,
          content: email.content,
          is_sent: true,
        });
      });
    })
    .catch((err) => {
      console.error("Error sending unsent emails:", err);
    });
}

export default sendUnsentEmails;
