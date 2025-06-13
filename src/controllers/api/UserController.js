import User from "../../models/User.js";
import bcrypt from "bcrypt";
import generateGuestEmail from "../../utils/generateGuestEmail.js";
import generateToken from "../../utils/generateToken.js";

export const show = async (req, res) => {
  const id = req.params.id;
  const user = await User.query().findById(id);

  if (!user) {
    return res.status(404).json({ message: "User niet gevonden." });
  }

  return res.json(user);
};

export const index = async (req, res) => {
  const users = await User.query().withGraphFetched("role");
  return res.json(users);
};

export const update = async (req, res) => {
  const id = req.params.id;
  const {
    firstname,
    lastname,
    email,
    password,
    role_id,
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
      role_id,
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

export const getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const user = await User.query().where("email", email).first();
  if (!user) {
    return res.status(404).json({ message: "User niet gevonden." });
  }
  return res.json(user);
};

export const destroy = async (req, res) => {
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

export const store = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    role_id,
    receive_notifications,
  } = req.body;

  try {
    if (role_id === 3) {
      const guestEmail = generateGuestEmail(firstname, lastname);

      await User.query().insert({
        firstname,
        lastname,
        email: guestEmail,
        password: generateToken(),
        role_id: 3,
        receive_notifications: receive_notifications !== false,
      });
    }
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
      role_id: role_id || 2,
      receive_notifications: receive_notifications !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Gebruiker succesvol aangemaakt",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Er is een fout opgetreden bij het aanmaken van de gebruiker.",
      error: error.message,
    });
  }
};

export const findByName = async (req, res) => {
  const { name } = req.params;

  if (name === "undefined") {
    try {
      const users = await User.query().withGraphFetched("role");
      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van gebruikers.",
        error: error.message,
      });
    }
  }

  try {
    const users = await User.query()
      .withGraphFetched("role")
      .where("firstname", "like", `%${name}%`)
      .orWhere("lastname", "like", `%${name}%`);

    return res.json(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het zoeken naar gebruikers.",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password, current_password, receive_notifications } =
      req.body;

    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Gebruiker niet gevonden",
      });
    }

    if (email !== user.email) {
      const existingUser = await User.query()
        .where("email", email)
        .whereNot("id", userId)
        .first();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Dit e-mailadres is al in gebruik",
        });
      }
    }

    const userData = {
      email,
      receive_notifications,
    };

    if (password && current_password) {
      const passwordMatches = await bcrypt.compare(
        current_password,
        user.password
      );

      if (!passwordMatches) {
        return res.status(400).json({
          success: false,
          message: "Huidig wachtwoord is onjuist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.query().patchAndFetchById(userId, userData);

    return res.status(200).json({
      success: true,
      message: "Profiel succesvol bijgewerkt",
      data: {
        email: updatedUser.email,
        receive_notifications: updatedUser.receive_notifications,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Er is een fout opgetreden bij het bijwerken van je profiel",
      error: error.message,
    });
  }
};

export const findByRole = async (req, res) => {
  const { roleId } = req.params;

  if (roleId === "undefined") {
    try {
      const users = await User.query().withGraphFetched("role");
      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van gebruikers.",
        error: error.message,
      });
    }
  }

  try {
    const users = await User.query()
      .withGraphFetched("role")
      .where("role_id", roleId);

    return res.json(users);
  } catch (error) {
    console.log("Error fetching users by role:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het zoeken naar gebruikers.",
      error: error.message,
    });
  }
};

export const searchUsersForRekeningen = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    let search = User.query()
      .withGraphFetched("orders.orderItems")
      .orderBy("firstname", "asc");

    if (searchTerm && searchTerm !== "all" && searchTerm !== "undefined") {
      search = search.where(function () {
        this.where("firstname", "like", `%${searchTerm}%`).orWhere(
          "lastname",
          "like",
          `%${searchTerm}%`
        );
      });
    }

    const users = await search;
    const usersWithTotals = users.map((user) => {
      return user;
    });

    res.json(usersWithTotals);
  } catch (error) {
    console.error("Error searching users for rekeningen:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users for rekeningen",
      error: error.message,
    });
  }
};
