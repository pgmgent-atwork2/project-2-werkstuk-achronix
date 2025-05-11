// ---------------------- Import modules ----------------------
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";

//import controllers
import * as PageController from "./controllers/PageController.js";
import * as AuthController from "./controllers/AuthController.js";
import * as API_UserController from "./controllers/api/UserController.js";
import * as API_ConsumableController from "./controllers/api/ConsumableController.js";
import * as API_CategoryController from "./controllers/api/CategoryController.js";
import * as API_TeamController from "./controllers/api/TeamController.js";
import * as API_PasswordResetController from "./controllers/api/PasswordResetController.js";
import { sendMail } from "./utils/mailer.js";




// ---------------------- App configuration ----------------------
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.resolve("src", "views"));
app.set("layout", "layouts/main");

app.use(express.static("public"));

// ---------------------- App routes ----------------------

// Voeg de currentPath middleware toe aan alle routes
app.use(PageController.addCurrentPath);

// zorgt ervoor dat localhost dashboard laadt
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Page routes
app.get("/dashboard", PageController.dashboard);
app.get("/bestellen", PageController.bestellen);
app.get("/wedstrijden", PageController.wedstrijden);
app.get("/profiel", PageController.profiel);

// Auth routes
app.get("/login", AuthController.login);
app.post("/login", AuthController.postLogin, AuthController.login);
app.get("/uitloggen", AuthController.logout);
app.get("/logout", AuthController.logout);

// Users
app.get("/api/users", API_UserController.index);
app.get("/api/users/:id", API_UserController.show);
app.put("/api/users/:id", API_UserController.update);


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

// Password Reset
app.post("/api/password-reset", API_PasswordResetController.requestPasswordReset);
app.get("/password-reset", API_PasswordResetController.checkValidToken);



sendMail("Quintenclaes@gmail.com" , "Test mail", "<h1>Test</h1>")

// ---------------------- Start the app ----------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
