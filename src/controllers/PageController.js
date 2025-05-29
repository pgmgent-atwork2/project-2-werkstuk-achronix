import Match from "../models/Match.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Consumable from "../models/Consumable.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Attendance from "../models/Attendance.js";

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
  const orders = await Order.query()
    .withGraphFetched("orderItems.consumable")
    .where("user_id", user.id);

  const totalPrice = orders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    return acc + orderTotal;
  }, 0);

  res.render("pages/dashboard", {
    pageTitle: "Dashboard | Ping Pong Tool",
    user,
    orders,
    totalPrice: totalPrice.toFixed(2),
  });
};

export const bestellen = async (req, res) => {
  const user = req.user;
  const consumables = await Consumable.query();
  const categories = await Category.query();

  res.render("pages/bestellen", {
    pageTitle: "Bestellen | Ping Pong Tool",
    user,
    consumables,
    categories,
  });
};

export const wedstrijden = async (req, res) => {
  const user = req.user;
  const matches = await Match.query()
    .withGraphFetched("team")
    .orderBy("date", "asc");
  const teams = await Team.query().orderBy("name", "asc");
  const users = await User.query().orderBy("firstname", "asc");

  // Get attendance data for the current user across all matches
  const attendanceData = await Attendance.query()
    .where("user_id", user.id)
    .select("match_id", "status", "is_selected");

  // Create a map of attendance data by match_id for easier lookup
  const attendanceMap = {};
  attendanceData.forEach((item) => {
    attendanceMap[item.match_id] = {
      status: item.status || "unknown",
      isSelected: item.is_selected || "not_selected",
    };
  });

  res.render("pages/wedstrijden", {
    pageTitle: "Wedstrijden | Ping Pong Tool",
    user,
    matches: matches,
    teams: teams,
    users: users,
    attendanceMap: attendanceMap,
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
export const speeldataBeheer = async (req, res) => {
  const user = req.user;

  const matches = await Match.query()
    .withGraphFetched("team")
    .orderBy("date", "asc");
  const teams = await Team.query().orderBy("name", "asc");

  res.render("pages/beheer/speeldataBeheer", {
    pageTitle: "Wedstrijden beheren | Ping Pong Tool",
    title: "Wedstrijden",
    matches: matches,
    teams: teams,
    user,
  });
};
export const bestellingenBeheer = async (req, res) => {
  const user = req.user;

  const orders = await Order.query()
    .withGraphFetched("user")
    .withGraphFetched("orderItems.consumable")
    .orderBy("order_on", "desc");

  res.render("pages/beheer/bestellingenBeheer", {
    pageTitle: "Bestellingen beheren | Ping Pong Tool",
    user,
    orders,
  });
};

export const forgotPasswordConfirmation = async (req, res) => {
  res.render("pages/forgotPasswordConfirmation", {
    pageTitle: "Email verstuurt | Ping Pong Tool",

    email: req.email,
    layout: "layouts/authentication",
  });
};

export const expiredToken = async (req, res) => {
  res.render("pages/expiredToken", {
    pageTitle: "Sessie is verlopen | Ping Pong Tool",
    layout: "layouts/authentication",
  });
};

// Error pages
export const pageNotFound = async (req, res) => {
  const user = req.user || null;

  res.status(404).render("errors/404", {
    pageTitle: "Pagina niet gevonden | Ping Pong Tool",
    user,
    layout: user ? "layouts/main" : "layouts/authentication",
  });
};
