import { validationResult } from "express-validator";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkValidToken } from "../middleware/ValidateResetToken.js";
import { handleRequestPasswordReset } from "./PasswordResetController.js";

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

    const user = await User.query().findOne({
      email: req.body.email,
    });

    if (!user) {
      req.formErrorFields = { email: "This user does not exist." };
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
        { userId: user.id, email: user.email },
        process.env.TOKEN_SALT,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/");
    } else {
      req.formErrorFields = {
        password: "You entered an invalid password.",
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

export const forgotPassword = async (req, res) => {
  const inputs = [
    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields["email"] : "",
    },
  ];

  const flash = req.flash || {};

  res.render("pages/requestResetPassword", {
    layout: "layouts/authentication",
    inputs,
    flash,
  });
};

export const postForgotPassword = async (req, res, next) => {
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

    const user = await User.query().findOne({
      email: req.body.email,
    });

    if (!user) {
      req.formErrorFields = { email: "This user does not exist." };
      req.flash = {
        type: "danger",
        message: "Errors occurred.",
      };

      if (user) {
        handleRequestPasswordReset(req, res);
        req.flash = {
          type: "success",
          message: "Check your email for the reset link.",
        };
      }

      return next();
    }
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res) => {
  const inputs = [
    {
      name: "token",
      label: "",
      type: "hidden",
      value: req.query.token,
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

  res.render("pages/resetPassword", {
    layout: "layouts/authentication",
    inputs,
    flash,
  });
};

export const postResetPassword = async (req, res, next) => {
  console.log("postResetPassword");
  try {
    const isValid = await checkValidToken(req, res);

    console.log(isValid);

    if (isValid) {
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

      const userId = await PasswordReset.query().findOne({
        token: req.body.token,
      });

      const user = await User.query().findOne({
        id: userId.user_id,
      });

      if (user) {
        const { firstname, lastname, email } = user;
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        await User.query()
          .update({ firstname, lastname, email, password: hashedPassword })
          .where("id", user.id);

        req.flash = {
          type: "success",
          message: "Password reset successfully.",
        };
        return res.redirect("/login");
      }
    }
  } catch (e) {
    next(e);
  }
};
