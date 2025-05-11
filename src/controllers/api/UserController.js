import User from "../../models/User.js";

export const show = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.query().findById(id);

  if (!user) {
    return res.status(404).json({ message: "User niet gevonden." });
  }

  return res.json(user);
};

export const index = async (req, res, next) => {
  const users = await User.query();
  return res.json(users);
};

export const getUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  const user = await User.query().where("email", email).first();
  if (!user) {
    return res.status(404).json({ message: "User niet gevonden." });
  }
  return res.json(user);
};
