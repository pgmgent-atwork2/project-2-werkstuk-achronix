export default (req, res, next) => {
  // Check of gebruiker adminrechten heeft
  if (!req.user || !req.user.is_admin) {
    return res.status(403).render("errors/no-acces", {
      pageTitle: "Geen toegang | Ping Pong Tool",
      user: req.user,
    });
  }

  next();
};
