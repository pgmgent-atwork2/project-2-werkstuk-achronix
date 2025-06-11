// ---------------------- Import modules ----------------------
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import session from "express-session";
import flash from "connect-flash";

// routes
import apiRouter from "./routes/api.js";
import PageRouter from "./routes/pages.js";

// middleware
import AuthResetPasswordValidation from "./middleware/validation/AuthResetPasswordValidation.js";

//import controllers
import * as AuthController from "./controllers/AuthController.js";
import * as ImportMatchesController from "./controllers/importMatchesController.js";
import * as PaymentController from "./controllers/PaymentController.js";
import ExportController from "./controllers/ExportController.js";

import * as PageController from "./controllers/PageController.js";

import { checkValidToken } from "./middleware/ValidateResetToken.js";
import * as PasswordResetController from "./controllers/PasswordResetController.js";

import sendUnsentEmails from "./jobs/sendUnsentEmails.js";
import { CronJob } from "cron";
import { transporter } from "./utils/mailer.js";
import {
  deleteConsumable,
  updateConsumableImage,
  uploadConsumableImage,
} from "./controllers/ConsumableUploadController.js";

//import middleware
import jwtAuth from "./middleware/jwtAuth.js";
import checkAdmin from "./middleware/checkAdmin.js";

//environment variables
import dotenv from "dotenv";
dotenv.config();

// ---------------------- App configuration ----------------------
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.resolve("src", "views"));
app.set("layout", "layouts/main");
app.use(fileUpload());
app.use(flash());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pingpong-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// ---------------------- App routes ----------------------

app.use(PageController.addCurrentPath);
// Add flash messages to all routes
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});

app.post(
  "/beheerderspaneel/wedstrijden/import",
  jwtAuth,
  checkAdmin,
  ImportMatchesController.importIcs
);

// Auth routes
app.get("/login", AuthController.login);
app.post("/login", AuthController.postLogin, AuthController.login);
app.get("/uitloggen", AuthController.logout);
app.get("/logout", AuthController.logout);
app.get("/forgot-password", PasswordResetController.forgotPassword);
app.post(
  "/forgot-password",
  PasswordResetController.postForgotPassword,
  PasswordResetController.forgotPassword
);

// Password reset
app.get(
  "/reset-password",
  PasswordResetController.resetPassword,
  checkValidToken
);
app.post(
  "/reset-password",
  AuthResetPasswordValidation,
  PasswordResetController.postResetPassword,
  PasswordResetController.resetPassword
);

app.post("/create-payment", PaymentController.createPayment);
app.get("/betaling/result", PaymentController.paymentResult);
app.post("/process-cash-payment", PaymentController.processCashPayment);

app.post("/upload/consumable-image", uploadConsumableImage);
app.put("/upload/consumable-image", updateConsumableImage);
app.delete("/upload/consumable-image", deleteConsumable);

app.get("/export-data", ExportController);

app.use("/api", apiRouter);
app.use(PageRouter);

// ---------------------- Error routes ----------------------
// 404 error page

// cronJobs

const EVERY_12_HOURS = "0 */12 * * *";

try {
  if (await transporter.verify()) {
    const job = new CronJob(EVERY_12_HOURS, async () => {
      await sendUnsentEmails();
    });

    job.start();
  }
} catch (error) {
  console.error("Error verifying transporter:", error);
}

// ---------------------- Start the app ----------------------
app.listen(port, () => {
  console.log(
    `Run docker compose up to start mailserver on http://localhost:8025 `
  );
  console.log(`Server running at http://localhost:${port}`);
});
