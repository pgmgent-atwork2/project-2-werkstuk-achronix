import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendMail } from "../utils/mailer.js";

export const handleRequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.query().where("email", email).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt + 15 * 60 * 1000);

    const addToken = await PasswordReset.query().insert({
      user_id: user.id,
      token,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (addToken) {
      sendMail(
        email,
        "Password Reset Request",
        `<p>Click <a href="localhost:3000/reset-password?token=${token}">here</a> to reset your password. The link will expire in 15 minutes.</p>`
      );

      return res.redirect("/email-sent");
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
