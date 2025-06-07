import { Router } from "express";

import * as API_UserController from "../controllers/api/UserController.js";
import * as API_ConsumableController from "../controllers/api/ConsumableController.js";
import * as API_CategoryController from "../controllers/api/CategoryController.js";
import * as API_TeamController from "../controllers/api/TeamController.js";
import * as API_MatchController from "../controllers/api/MatchController.js";
import * as API_OrderController from "../controllers/api/OrderController.js";
import * as API_OrderItemsController from "../controllers/api/OrderItemsController.js";
import * as API_AttendanceController from "../controllers/api/AttendanceController.js";
import jwtAuth from "../middleware/jwtAuth.js";

const router = new Router();

// users
router.get("/users", API_UserController.index);
router.post("/users", API_UserController.store);
router.put("/users/profile", jwtAuth, API_UserController.updateProfile);
router.get("/users/:id", API_UserController.show);
router.get("/users/name/:name", API_UserController.findByName);
router.put("/users/:id", API_UserController.update);
router.delete("/users/:id", API_UserController.destroy);

// Consumables
router.get("/consumables", API_ConsumableController.index);
router.get("/consumables/:id", API_ConsumableController.show);
router.get("/consumables/name/:name", API_ConsumableController.findByName);
router.get(
  "/consumables/category/:categoryId",
  API_ConsumableController.findByCategory
);
router.post("/consumables", API_ConsumableController.store);
router.put("/consumables/:id", API_ConsumableController.update);
router.put("/consumables/:id/stock", API_ConsumableController.updateStock);
router.delete("/consumables/:id", API_ConsumableController.destroy);

// Categories
router.get("/categories", API_CategoryController.index);
router.get("/categories/:id", API_CategoryController.show);
router.post("/categories", API_CategoryController.store);
router.put("/categories/:id", API_CategoryController.update);
router.delete("/categories/:id", API_CategoryController.destroy);

//Team
router.get("/teams", API_TeamController.index);
router.get("/teams/:id", API_TeamController.show);
router.post("/teams", API_TeamController.store);
router.put("/teams/:id", API_TeamController.update);
router.delete("/teams/:id", API_TeamController.destroy);

// Matches
router.get("/matches", API_MatchController.index);
router.get("/matches/:id", API_MatchController.show);
router.post("/matches", API_MatchController.store);
router.put("/matches/:id", API_MatchController.update);
router.delete("/matches/:id", API_MatchController.destroy);

// Attendance routes
router.get(
  "/attendance/match/:matchId/user/:userId",
  API_AttendanceController.getAttendance
);
router.get(
  "/attendance/match/:matchId",
  API_AttendanceController.getAttendance
);
router.get(
  "/attendance/match/:matchId/search/:searchTerm",
  API_AttendanceController.searchUsersInMatch
);
router.post("/attendance/update", API_AttendanceController.updateAttendance);
router.post(
  "/attendance/selection",
  jwtAuth,
  API_AttendanceController.updateSelection
);
// Standard attendance routes
router.get("/attendance", API_AttendanceController.index);
router.get("/attendance/:id", API_AttendanceController.show);
router.post("/attendance", API_AttendanceController.store);
router.put("/attendance/:id", API_AttendanceController.update);
router.delete("/attendance/:id", API_AttendanceController.destroy);

// Orders
router.get("/orders", API_OrderController.index);
router.get("/orders/:id", API_OrderController.show);
router.get("/orders/name/:name", API_OrderController.findByName);
router.get("/orders/status/:status", API_OrderController.findByStatus);
router.post("/orders", API_OrderController.store);
router.put("/orders/:id", API_OrderController.update);
router.delete("/orders/:id", API_OrderController.destroy);

// Order items
router.get("/order-items", API_OrderItemsController.index);
router.get("/order-items/:id", API_OrderItemsController.show);
router.get(
  "/order-items/order/:orderId",
  API_OrderItemsController.getItemsByOrder
);
router.post("/order-items", API_OrderItemsController.store);
router.put("/order-items/:id", API_OrderItemsController.update);
router.delete("/order-items/:id", API_OrderItemsController.destroy);

export default router;
