import PasswordReset from "../../models/PasswordReset.js";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

export const requestPasswordReset = async (req, res) => {
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
      return res.status(200).json({
        message: "Password reset token generated successfully",
        token,
        expires_at: expiresAt.toISOString(),
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const checkValidToken = async (req, res) => {
  const resetToken = req.query.token;
  const passwordReset = await PasswordReset.findOne({
    where: { token: resetToken },
  });

  if (!passwordReset) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (passwordReset) {
    const currentDate = new Date();
    await PasswordReset.where("expires_at", "<", currentDate).del();
  }
};
