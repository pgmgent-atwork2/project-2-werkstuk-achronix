/**
 * Middleware om de huidige URL toe te voegen aan alle views
 */
export const addCurrentPath = (req, res, next) => {
  res.locals.currentPath = req.path;

  next();
};

// ---------------------- Dit rendert de paginas ----------------------

export const dashboard = (req, res) => {
  res.render("pages/dashboard", {
    pageTitle: "Dashboard | Ping Pong Tool",
    user: req.user,
  });
};

export const bestellen = (req, res) => {
  res.render("pages/bestellen", {
    pageTitle: "Bestellen | Ping Pong Tool",
  });
};

export const wedstrijden = async (req, res) => {
  try {
    const Match = (await import("../models/Match.js")).default;
    const Team = (await import("../models/Team.js")).default;

    // Get matches and teams for the dropdown
    const matches = await Match.query().orderBy("date", "asc");
    const teams = await Team.query().orderBy("name", "asc");

    res.render("pages/wedstrijden", {
      pageTitle: "Wedstrijden | Ping Pong Tool",
      title: "Wedstrijden",
      matches: matches,
      teams: teams,
    });
  } catch (error) {
    console.error("Error fetching match data:", error);
    res.render("pages/wedstrijden", {
      pageTitle: "Wedstrijden | Ping Pong Tool",
      title: "Wedstrijden",
      matches: [],
      teams: [],
      error: "Er is een probleem opgetreden bij het ophalen van wedstrijden.",
    });
  }
};

export const profiel = (req, res) => {
  res.render("pages/profiel", {
    pageTitle: "Profiel | Ping Pong Tool",
  });
};

export const beheerderspaneel = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const users = await User.query();

    res.render("pages/beheerderspaneel", {
      pageTitle: "Beheerderspaneel | Ping Pong Tool",
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.render("pages/beheerderspaneel", {
      pageTitle: "Beheerderspaneel | Ping Pong Tool",
      users: [],
      error: "Er is een probleem opgetreden bij het ophalen van gebruikers.",
    });
  }
};
