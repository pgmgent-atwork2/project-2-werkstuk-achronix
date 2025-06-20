import { validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const inputs = [
    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields["email"] : "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      err: req.formErrorFields?.password ? req.formErrorFields["password"] : "",
    },
  ];

  const flash = req.flash || {};

  res.render("pages/login", {
    layout: "layouts/authentication",
    inputs,
    flash,
    pageTitle: "Inloggen | Ping Pong Tool",
  });
};

export const postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.formErrorFields = {};

      errors.array().forEach((error) => {
        req.formErrorFields[error.path] = error.msg;
      });

      req.flash = {
        type: "danger",
        message: "Errors occurred",
      };

      return next();
    }

    const user = await User.query()
      .findOne({
        email: req.body.email,
      })
      .withGraphFetched("role");

    if (!user) {
      req.formErrorFields = { email: "Deze gebruiker bestaat niet." };
      req.flash = {
        type: "danger",
        message: "Errors occurred.",
      };

      return next();
    }

    const passwordMatches = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (passwordMatches) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: {
            id: user.role.id,
            name: user.role.name,
          },
        },
        process.env.TOKEN_SALT,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/");
    } else {
      req.formErrorFields = {
        password: "Ongeldig wachtwoord ingegeven.",
      };
      req.flash = {
        type: "danger",
        message: "Errors occurred",
      };
      return next();
    }
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.redirect("/login");
  } catch (e) {
    next(e);
  }
};
