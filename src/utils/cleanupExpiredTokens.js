import PasswordReset from "../models/PasswordReset.js";

export const cleanupExpiredTokens = async () => {
  try {
    const now = new Date().toISOString();
    const deleted = await PasswordReset.query()
      .delete()
      .where("expires_at", "<", now);

    return deleted;
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    throw error;
  }
};
