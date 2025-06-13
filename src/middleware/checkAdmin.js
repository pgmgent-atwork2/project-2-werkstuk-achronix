export default function checkAdmin(req, res, next) {
  if (!req.user) {
    console.log("No user found in request");
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({
        success: false,
        message: "Niet geautoriseerd",
      });
    } else {
      return res.redirect("/login");
    }
  }

  const isAdmin = req.user.role_id === 1;

  if (!isAdmin) {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(403).json({
        success: false,
        message: "Alleen admins hebben toegang tot deze functie",
      });
    } else {
      return res.status(403).render("errors/no-acces", {
        pageTitle: "Toegang geweigerd | Ping Pong Tool",
        user: req.user,
        layout: "layouts/main",
      });
    }
  }

  next();
}
