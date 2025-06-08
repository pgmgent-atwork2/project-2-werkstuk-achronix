export default (req, res, next) => {
  if (!req.user || !req.user.role.name === "admin") {
    return res.status(403).render("errors/no-acces", {
      pageTitle: "Geen toegang | Ping Pong Tool",
      user: req.user,
    });
  }

  next();
};
