import Match from "../models/Match.js";
import Team from "../models/Team.js";
import User from "../models/User.js";

/**
 * Middleware om de huidige URL toe te voegen aan alle views
 */
export const addCurrentPath = (req, res, next) => {
  res.locals.currentPath = req.path;

  next();
};

// ---------------------- Dit rendert de paginas ----------------------

export const dashboard = async (req, res) => {
  const user = req.user;

  res.render("pages/dashboard", {
    pageTitle: "Dashboard | Ping Pong Tool",
    user,
  });
};

export const bestellen = (req, res) => {
  const user = req.user;

  res.render("pages/bestellen", {
    pageTitle: "Bestellen | Ping Pong Tool",
    user,
  });
};

export const wedstrijden = async (req, res) => {
  const user = req.user;

  res.render("pages/wedstrijden", {
    pageTitle: "Wedstrijden | Ping Pong Tool",
    user,
  });
};

export const profiel = (req, res) => {
  const user = req.user;

  res.render("pages/profiel", {
    pageTitle: "Profiel | Ping Pong Tool",
    user,
  });
};

//Beheerderspaneel

export const beheerderspaneel = async (req, res) => {
  const user = req.user;

  const users = await User.query();

  res.render("pages/beheer/beheerderspaneel", {
    pageTitle: "Beheerderspaneel | Ping Pong Tool",
    users: users,
    user,
  });
};
export const ledenBeheer = async (req, res) => {
  const user = req.user;

  const users = await User.query();

  res.render("pages/beheer/ledenBeheer", {
    pageTitle: "Leden beheren | Ping Pong Tool",
    users: users,
    user,
  });
};
export const wedstrijdenBeheer = async (req, res) => {
  const user = req.user;

  const matches = await Match.query()
    .withGraphFetched("team")
    .orderBy("date", "asc");
  const teams = await Team.query().orderBy("name", "asc");

  res.render("pages/beheer/wedstrijdenBeheer", {
    pageTitle: "Wedstrijden beheren | Ping Pong Tool",
    title: "Wedstrijden",
    matches: matches,
    teams: teams,
    user,
  });
};
export const bestellingenBeheer = async (req, res) => {
  const user = req.user;

  res.render("pages/beheer/bestellingenBeheer", {
    pageTitle: "Bestellingen beheren | Ping Pong Tool",
    user,
  });
};

// Error pages
export const pageNotFound = async (req, res) => {
  const user = req.user;

  res.render("errors/page-not-found", {
    pageTitle: "Pagina niet gevonden | Ping Pong Tool",
    user,
  });
};
