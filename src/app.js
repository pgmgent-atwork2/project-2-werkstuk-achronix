//environment variables
import dotenv from "dotenv";
dotenv.config();

// ---------------------- Import modules ----------------------
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";

//import controllers
import * as PageController from "./controllers/PageController.js";
import * as AuthController from "./controllers/AuthController.js";

//import middleware
import jwtAuth from "./middleware/jwtAuth.js";

// ---------------------- App configuration ----------------------
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie-parser middleware
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.resolve("src", "views"));
app.set("layout", "layouts/main");

app.use(express.static("public"));

// ---------------------- App routes ----------------------

// Page routes
app.get("/", jwtAuth, PageController.home);

// Auth routes
app.get("/login", AuthController.login);
app.post("/login", AuthController.postLogin, AuthController.login);
app.get("/logout", AuthController.logout);

// ---------------------- Start the app ----------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
