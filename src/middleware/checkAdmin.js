export default function checkAdmin(req, res, next) {
  if (!req.user) {
    console.log("No user found in request");
    return res.status(401).json({
      success: false,
      message: "Niet geautoriseerd",
    });
  }

  const isAdmin =
    req.user.role_id === true ||
    req.user.role_id === 1 ||
    req.user.role_id === "true";

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Alleen admins hebben toegang tot deze functie",
    });
  }

  next();
}
