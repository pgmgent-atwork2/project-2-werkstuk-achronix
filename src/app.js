// ---------------------- Import modules ----------------------
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import session from "express-session";
import flash from "connect-flash";

//import controllers
import * as PageController from "./controllers/PageController.js";
import * as AuthController from "./controllers/AuthController.js";
import * as MatchController from "./controllers/MatchController.js";
import * as API_UserController from "./controllers/api/UserController.js";
import * as API_ConsumableController from "./controllers/api/ConsumableController.js";
import * as API_CategoryController from "./controllers/api/CategoryController.js";
import * as API_TeamController from "./controllers/api/TeamController.js";

import { checkValidToken } from "./middleware/ValidateResetToken.js";
import * as PasswordResetController  from "./controllers/PasswordResetController.js";

//import middleware
import jwtAuth from "./middleware/jwtAuth.js";

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

// Add the currentPath middleware to all routes
app.use(PageController.addCurrentPath);

// Add flash messages to all routes
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});

// zorgt ervoor dat localhost dashboard laadt
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Page routes
app.get("/dashboard", jwtAuth, PageController.dashboard);
app.get("/bestellen", jwtAuth, PageController.bestellen);
app.get("/wedstrijden", jwtAuth, PageController.wedstrijden);
app.post("/wedstrijden/import", jwtAuth, MatchController.importIcs);
app.get("/profiel", jwtAuth, PageController.profiel);
app.get("/beheerderspaneel", jwtAuth, PageController.beheerderspaneel);

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

// Users
app.get("/api/users", API_UserController.index);
app.post("/api/users", API_UserController.store);
app.get("/api/users/:id", API_UserController.show);
app.put("/api/users/:id", API_UserController.update);
app.delete("/api/users/:id", API_UserController.destroy);

// Consumables
app.get("/api/consumables", API_ConsumableController.index);
app.get("/api/consumables/:id", API_ConsumableController.show);
app.post("/api/consumables", API_ConsumableController.store);
app.put("/api/consumables/:id", API_ConsumableController.update);
app.delete("/api/consumables/:id", API_ConsumableController.destroy);

// Categories
app.get("/api/categories", API_CategoryController.index);
app.get("/api/categories/:id", API_CategoryController.show);
app.post("/api/categories", API_CategoryController.store);
app.put("/api/categories/:id", API_CategoryController.update);
app.delete("/api/categories/:id", API_CategoryController.destroy);

//Team
app.get("/api/teams", API_TeamController.index);
app.get("/api/teams/:id", API_TeamController.show);
app.post("/api/teams", API_TeamController.store);
app.put("/api/teams/:id", API_TeamController.update);
app.delete("/api/teams/:id", API_TeamController.destroy);

// Password reset
app.get("/reset-password", PasswordResetController.resetPassword, checkValidToken);
app.post(
  "/reset-password",
  PasswordResetController.postResetPassword,
  PasswordResetController.resetPassword
);

// ---------------------- Start the app ----------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
