import crypto from "crypto";

export default function generateToken() {
  const token = crypto.randomBytes(32).toString("hex");

  return token;
}
