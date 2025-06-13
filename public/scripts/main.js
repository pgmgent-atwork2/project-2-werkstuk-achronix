import "./sidebar.js";
import "./user/search-users.js";
import "./edit-match.js";
import "./delete-match.js";
import "./create-match.js";
import "./match-attendance.js";
import "./player-selection.js";
import "./match-filter.js";
import "./match-user-search.js";

import "/scripts/profile.js";

import "./search-orders.js";

import "./consumable/search-consumables.js";

import "./team/create-team.js";

import { InitShoppingCart } from "./shoppingCart.js";
import initDropdown from "./dropdown.js";

import { createConsumable } from "./consumable/create-consumable.js";
import { editConsumable } from "./consumable/edit-consumable.js";
import { deleteConsumable } from "./consumable/delete-consumable.js";

import { createGuestUser } from "./user/create-guest-user.js";
import { createUser } from "./user/create-user.js";
import { editUser } from "./user/edit-user.js";
import { deleteUser } from "./user/delete-user.js";

document.addEventListener("DOMContentLoaded", function () {
  createConsumable();
  editConsumable();
  deleteConsumable();

  createUser();
  editUser();
  deleteUser();

  createGuestUser();

  InitShoppingCart();
  initDropdown();
});
