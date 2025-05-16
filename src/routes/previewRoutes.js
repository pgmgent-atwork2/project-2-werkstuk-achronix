import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Only available in development environment
if (process.env.NODE_ENV === "development") {
  // Route to preview password reset email
  router.get("/preview/email/password-reset", async (req, res) => {
    try {
      const templatePath = path.join(
        __dirname,
        "../views/emails/passwordReset.ejs"
      );
      const html = await ejs.renderFile(templatePath, {
        resetUrl:
          "http://localhost:3000/reset-password?token=sample-token-12345",
        username: "Testgebruiker",
      });

      res.send(html);
    } catch (error) {
      res.status(500).send(`Error previewing template: ${error.message}`);
    }
  });
}

export default router;
