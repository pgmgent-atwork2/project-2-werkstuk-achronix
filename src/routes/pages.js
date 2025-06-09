import { Router } from "express";

import * as PageController from "../controllers/PageController.js";
import jwtAuth from "../middleware/jwtAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = new Router();

router.use(PageController.addCurrentPath);

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/dashboard", jwtAuth, PageController.dashboard);
router.get("/bestellen", jwtAuth, PageController.bestellen);
router.get("/wedstrijden/a", jwtAuth, (req, res) =>
  PageController.wedstrijden(req, res, "a")
);
router.get("/wedstrijden/b", jwtAuth, (req, res) =>
  PageController.wedstrijden(req, res, "b")
);
router.get("/wedstrijden/c", jwtAuth, (req, res) =>
  PageController.wedstrijden(req, res, "c")
);
router.get("/wedstrijden", jwtAuth, PageController.wedstrijdenTeamsOverview);
router.get("/rekening", jwtAuth, PageController.rekening);
router.get("/profiel", jwtAuth, PageController.profiel);

// Page routes beheerderspaneel
router.get(
  "/beheerderspaneel",
  jwtAuth,
  checkAdmin,
  PageController.beheerderspaneel
);
router.get(
  "/beheerderspaneel/leden",
  jwtAuth,
  checkAdmin,
  PageController.ledenBeheer
);
router.get(
  "/beheerderspaneel/speeldata",
  jwtAuth,
  checkAdmin,
  PageController.speeldataBeheer
);

router.get(
  "/beheerderspaneel/bestellingen",
  jwtAuth,
  checkAdmin,
  PageController.bestellingenBeheer
);
router.get(
  "/beheerderspaneel/rekeningen",
  jwtAuth,
  checkAdmin,
  PageController.rekeningenBeheer
);
router.get(
  "/beheerderspaneel/rekeningen/:id",
  jwtAuth,
  checkAdmin,
  PageController.userRekeningDetails
);

router.get(
  "/beheerderspaneel/producten",
  jwtAuth,
  checkAdmin,
  PageController.consumablesBeheer
);
router.get(
  "/beheerderspaneel/notificaties",
  jwtAuth,
  checkAdmin,
  PageController.notificatiesBeheer
);
router.get(
  "/beheerderspaneel/uitgavelimiet",
  jwtAuth,
  checkAdmin,
  PageController.uitgavelimiet
);

router.get(
  "/forgot-password-confirmation",
  PageController.forgotPasswordConfirmation
);
router.get("/password-reset/expired-token", PageController.expiredToken);

// payment

router.get("/betaling/mislukt", PageController.orderFailed);
router.get("/betaling/bedankt", PageController.orderComplete);

router.use(jwtAuth, (req, res) => {
  return PageController.pageNotFound(req, res);
});

export default router;
