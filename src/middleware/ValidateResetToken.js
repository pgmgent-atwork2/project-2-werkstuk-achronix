import PasswordReset from "../models/PasswordReset.js";
export const checkValidToken = async (req, res) => {
  const resetToken = req.query.token || req.body.token;
  const passwordReset = await PasswordReset.query().where("token", resetToken);

  if (!passwordReset) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const currentDate = new Date();

  if (passwordReset) {
    await PasswordReset.query().where("expires_at", "<", currentDate).del();
  }

  if (await PasswordReset.query().where("expires_at", ">", currentDate)) {
    return true;
  }
};
