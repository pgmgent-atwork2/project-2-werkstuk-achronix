import PasswordReset from "../models/PasswordReset.js";
export const checkValidToken = async (req) => {
  const resetToken = req.query.token || req.body?.token;
  const passwordReset = await PasswordReset.query()
    .where("token", resetToken)
    .first();

  if (!passwordReset) {
    return false;
  }

  const currentDate = new Date();
  const expiresAt = new Date(passwordReset.expires_at);

  if (passwordReset) {
    await PasswordReset.query().where("expires_at", "<", expiresAt).del();
  }

  if (currentDate < expiresAt) {
    return true;
  } else {
    return false;
  }
};
