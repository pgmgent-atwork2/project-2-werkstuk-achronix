import Match from "../models/Match.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Consumable from "../models/Consumable.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
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

  if (!user || !user.id) {
    console.error("User not found in request:", req.user);
    return res.redirect("/login");
  }

  const orders = await Order.query()
    .withGraphFetched("orderItems.consumable")
    .where("user_id", user.id);

  const totalPrice = orders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    return acc + orderTotal;
  }, 0);

  let backInStockNotifications = [];
  let adminNotifications = [];

  try {
    const Notification = (await import("../models/Notification.js")).default;

    console.log(
      `Fetching notifications for user ${user.id} (${user.firstname})...`
    );

    // Haal back in stock notificaties op
    const stockNotifications = await Notification.query()
      .where("user_id", user.id)
      .where("type", "back_in_stock")
      .where("is_read", false)
      .orderBy("created_at", "desc");

    for (const notification of stockNotifications) {
      const consumable = await Consumable.query().findById(
        notification.consumable_id
      );
      if (consumable) {
        notification.consumable = consumable;
        backInStockNotifications.push(notification);
      }
    }

    // Haal admin berichten op (consumable_id = 0 voor admin berichten)
    adminNotifications = await Notification.query()
      .where("user_id", user.id)
      .where("type", "admin_message")
      .where("is_read", false)
      .orderBy("created_at", "desc");

    console.log(
      `Found ${backInStockNotifications.length} stock notifications and ${adminNotifications.length} admin notifications for user ${user.id}`
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }

  res.render("pages/dashboard", {
    pageTitle: "Dashboard | Ping Pong Tool",
    user,
    orders,
    totalPrice: totalPrice.toFixed(2),
    backInStockNotifications,
    adminNotifications,
  });
};

export const bestellen = async (req, res) => {
  const user = req.user;
  const consumables = await Consumable.query().orderBy("stock", "desc");
  const categories = await Category.query();

  res.render("pages/bestellen", {
    pageTitle: "Bestellen | Ping Pong Tool",
    user,
    consumables,
    categories,
  });
};

export const wedstrijden = async (req, res, teamLetter) => {
  const user = req.user;
  let matches = await Match.query()
    .withGraphFetched("team")
    .orderBy("date", "asc");

  // Filter matches by team letter if provided
  if (teamLetter) {
    const teamName = `${teamLetter.toUpperCase()}`;
    matches = matches.filter(
      (match) => match.team && match.team.name === teamName
    );
  }

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

  // Get attendance data for all users
  const allAttendanceData = await Attendance.query().select(
    "user_id",
    "match_id",
    "status",
    "is_selected"
  );

  // Create attendance data for each user
  const userAttendance = {};
  allAttendanceData.forEach((attendance) => {
    if (!userAttendance[attendance.user_id]) {
      userAttendance[attendance.user_id] = {};
    }
    userAttendance[attendance.user_id][attendance.match_id] = {
      status: attendance.status,
      is_selected: attendance.is_selected,
    };
  });

  // Add attendance data to each user
  users.forEach((user) => {
    user.attendance = userAttendance[user.id] || {};
  });

  res.render("pages/wedstrijden", {
    pageTitle: `Wedstrijden ${
      teamLetter ? `Team ${teamLetter.toUpperCase()}` : ""
    } | Ping Pong Tool`,
    user,
    matches: matches,
    teams: teams,
    users: users,
    attendanceMap: attendanceMap,
    teamLetter: teamLetter,
  });
};
export const wedstrijdenTeamsOverview = (req, res) => {
  const user = req.user;

  res.render("pages/wedstrijdenTeamsOverview", {
    pageTitle: "Wedstrijden Overview | Ping Pong Tool",
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

export const rekening = async (req, res) => {
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

  res.render("pages/rekening", {
    pageTitle: "Rekening | Ping Pong Tool",
    user,
    orders,
    totalPrice: totalPrice.toFixed(2),
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

export const consumablesBeheer = async (req, res) => {
  const user = req.user;

  const consumables = await Consumable.query();
  const categories = await Category.query();

  res.render("pages/beheer/consumablesBeheer", {
    pageTitle: "Producten beheren | Ping Pong Tool",
    user,
    consumables,
    categories,
  });
};

export const notificatiesBeheer = async (req, res) => {
  const user = req.user;

  try {
    const Notification = (await import("../models/Notification.js")).default;

    const rawNotifications = await Notification.query()
      .where("type", "admin_message")
      .orderBy("created_at", "desc");

    const uniqueNotifications = [];
    const seen = {};

    rawNotifications.forEach((notification) => {
      const key = `${notification.title}-${notification.message}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueNotifications.push(notification);
      }
    });

    res.render("pages/beheer/notificaties", {
      pageTitle: "Notificaties beheren | Ping Pong Tool",
      user,
      notifications: uniqueNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.render("pages/beheer/notificaties", {
      pageTitle: "Notificaties beheren | Ping Pong Tool",
      user,
      notifications: [],
    });
  }
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

export const orderComplete = async (req, res) => {
  const userId = req.query.userId;

  const user = await User.query().findById(userId);

  res.render("pages/orderComplete", {
    pageTitle: "betaling gelukt | Ping Pong Tool",
    user,
  });
};

export const orderFailed = async (req, res) => {
  const userId = req.query.userId;

  const user = await User.query().findById(userId);

  res.render("pages/orderFailed", {
    pageTitle: "betaling mislukt | Ping Pong Tool",
    user,
  });
};
