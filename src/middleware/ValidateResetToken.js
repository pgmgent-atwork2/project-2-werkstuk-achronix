import PasswordReset from "../models/PasswordReset.js";
export const checkValidToken = async (req, res) => {
  const resetToken = req.query.token || req.body.token;
  const passwordReset = await PasswordReset.query()
    .where("token", resetToken)
    .first();

  if (!passwordReset) {
    return res.redirect("/password-reset/expired-token");
  }

  const currentDate = new Date();

  if (passwordReset) {
    await PasswordReset.query().where("expires_at", "<", currentDate).del();
  }

  if (await PasswordReset.query().where("expires_at", ">", currentDate)) {
    return true;
  } else {
    return res.redirect("/password-reset/expired-token");
  }
};
