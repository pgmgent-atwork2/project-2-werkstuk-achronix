import User from "../../models/User.js";
import bcrypt from "bcrypt";

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
  const {
    firstname,
    lastname,
    email,
    password,
    is_admin,
    receive_notifications,
  } = req.body;

  try {
    const userExists = await User.query().findById(id);
    if (!userExists) {
      return res.status(404).json({ message: "User niet gevonden." });
    }

    const userData = {
      firstname,
      lastname,
      email,
      is_admin,
      receive_notifications,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.query().patchAndFetchById(id, userData);
    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to update user", error: error.message });
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

export const destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.query().findById(id);

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden." });
    }

    await User.query().deleteById(id);
    return res.status(200).json({ message: "Gebruiker succesvol verwijderd." });
  } catch (error) {
    return res.status(500).json({
      message:
        "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
      error: error.message,
    });
  }
};

export const store = async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    password,
    is_admin,
    receive_notifications,
  } = req.body;

  try {
    const existingUser = await User.query().where("email", email).first();
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Een gebruiker met dit e-mailadres bestaat al." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.query().insert({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      is_admin: is_admin || false,
      receive_notifications: receive_notifications !== false,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({
      message: "Er is een fout opgetreden bij het aanmaken van de gebruiker.",
      error: error.message,
    });
  }
};
