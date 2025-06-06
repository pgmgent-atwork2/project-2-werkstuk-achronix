import "./utils/notifications.js";
import "./sidebar.js";
import "./edit-user.js";
import "./create-user.js";
import "./delete-user.js";
import "./search-users.js";
import "./edit-match.js";
import "./delete-match.js";
import "./create-match.js";
import "./match-attendance.js";
import "./player-selection.js";
import "./match-filter.js";
import "./search-orders.js";

import "./consumable/search-consumables.js";

import { InitShoppingCart } from "./shoppingCart.js";
import { createConsumable } from "./consumable/create-consumable.js";
import { editConsumables } from "./consumable/edit-consumable.js";
import { deleteConsumable } from "./consumable/delete-consumable.js";

document.addEventListener("DOMContentLoaded", function () {
  createConsumable();
  editConsumables();
  deleteConsumable();
  InitShoppingCart();
});
