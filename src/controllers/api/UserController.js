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

export const update = async (req, res, next) => {
  const id = req.params.id;
  const { firstname, lastname, email, password } = req.body;

  try {
    const userExists = await User.query().findById(id);
    if (!userExists) {
      return res.status(404).json({ message: "User niet gevonden." });
    }
    const updatedUser = await User.query().patchAndFetchById(id, {
      firstname,
      lastname,
      email,
      password,
    });
    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update user" });
  }
};

export const getUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  const user = await User.query().where("email", email).first();
  if (!user) {
    return res.status(404).json({ message: "User niet gevonden." });
  }
  return res.json(user);
};
