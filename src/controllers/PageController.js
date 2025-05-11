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
  });
};


export const bestellen = (req, res) => {
  res.render("pages/bestellen", {
    pageTitle: "Bestellen | Ping Pong Tool",
  });
};


export const wedstrijden = (req, res) => {
  res.render("pages/wedstrijden", {
    pageTitle: "Wedstrijden | Ping Pong Tool",
  });
};


export const profiel = (req, res) => {
  res.render("pages/profiel", {
    pageTitle: "Profiel | Ping Pong Tool",
  });
};

