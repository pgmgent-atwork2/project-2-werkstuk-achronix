import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendMail } from "../utils/mailer.js";
import { cleanupExpiredTokens } from "../utils/cleanupExpiredTokens.js";
import { checkValidToken } from "../middleware/ValidateResetToken.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export const handleRequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.query().where("email", email).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);

    const addToken = await PasswordReset.query().insert({
      user_id: user.id,
      token,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (addToken) {
      const emailSent = await sendMail(
        email,
        "Password Reset Request",
        `<p>Click <a href="http://localhost:3000/reset-password?token=${token}">here</a> to reset your password. The link will expire in 15 minutes.</p>`
      );

      if (emailSent) {
        await cleanupExpiredTokens();
        return res.redirect("/forgot-password-confirmation");
      } else {
        return res.render("pages/forgotPassword", {
          layout: "layouts/authentication",
          smtp_error:
            "Fout bij het verzenden van de e-mail. Probeer het later opnieuw.",
          pageTitle: "Wachtwoord vergeten | Ping Pong Tool",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
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

  res.render("pages/forgotPassword", {
    layout: "layouts/authentication",
    inputs,
    flash,
    pageTitle: "Wachtwoord vergeten | Ping Pong Tool",
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
      req.formErrorFields = { email: "Dit email bestaat niet." };
      req.flash = {
        type: "danger",
        message: "Errors occurred.",
      };

      return next();
    }

    if (user) {
      await handleRequestPasswordReset(req, res);
    }
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res) => {
  if (!req.query.token) {
    return res.redirect("/password-reset/expired-token");
  }

  const isvalid = await checkValidToken(req, res);

  if (isvalid) {
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
        err: req.formErrorFields?.password
          ? req.formErrorFields["password"]
          : "",
      },
    ];

    const flash = req.flash || {};

    res.render("pages/resetPassword", {
      layout: "layouts/authentication",
      inputs,
      flash,
      pageTitle: "Wachtwoord resetten | Ping Pong Tool",
    });
  } else {
    return res.redirect("/password-reset/expired-token");
  }
};

export const postResetPassword = async (req, res, next) => {
  try {
    const isValid = await checkValidToken(req, res);

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
    } else {
      return res.redirect("/password-reset/expired-token");
    }
  } catch (e) {
    next(e);
  }
};
