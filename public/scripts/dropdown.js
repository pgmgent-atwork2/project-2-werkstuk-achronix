import renderConsumableCard from "./consumable/consumable-card.js";
import renderConsumableCardDisabled from "./consumable/consumable-card-disabled.js";
import { InitShoppingCart } from "./shoppingCart.js";
import getAllConsumables from "./getAllConsumables.js";

export default function initDropdown() {
  if (!document.querySelector(".dropdown")) {
    return;
  }

  const $button = document.querySelector(".dropdown-btn");
  const $loggedInUser = document.getElementById("logged-in-user");
  const $searchInputUsers = document.getElementById("search-input-users");
  const $userIdOrder = document.querySelectorAll(".user-id-order");
  const $dropdownMenu = document.querySelector(".dropdown-content");
  const $list = document.querySelector(".dropdown-list");
  const $selectedUserName = document.getElementById("selected-user-name");
  const $resetToOwnAccountBtn = document.getElementById("reset-to-own-account");
  const $originalUserId = document.getElementById("original-user-id");
  const $originalUserName = document.getElementById("original-user-name");

  let allUsers = [];

  function initializeUsers() {
    const $searchUsers = document.querySelectorAll(".search-user");
    allUsers = Array.from($searchUsers).map(($searchUser) => ({
      id: $searchUser.dataset.id,
      name: $searchUser.textContent.trim(),
    }));
  }

  initializeUsers();

  $list.addEventListener("click", async function (e) {
    const $searchUser = e.target.closest(".search-user");
    if ($searchUser) {
      const userId = $searchUser.dataset.id;
      const userName = $searchUser.textContent.trim();
      const $consumables = document.querySelector(".consumables");

      $consumables.innerHTML = "";

      const consumables = await getAllConsumables();
      consumables.forEach((consumable) => {
        if (consumable.stock <= 0) {
          renderConsumableCardDisabled(consumable, $consumables, userId);
        } else {
          renderConsumableCard(consumable, $consumables, userId);
        }
      });

      InitShoppingCart();

      $loggedInUser.value = userId;
      $userIdOrder.forEach(($userId) => {
        $userId.value = userId;
      });

      if ($selectedUserName) {
        $selectedUserName.textContent = userName;
      }
      $dropdownMenu.classList.add("hidden");
    }
  });

  $button.addEventListener("click", function (event) {
    event.stopPropagation();
    $dropdownMenu.classList.toggle("hidden");
  });

  $searchInputUsers.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    const filteredUsers =
      searchTerm.length === 0
        ? allUsers
        : allUsers.filter((user) =>
            user.name.toLowerCase().includes(searchTerm)
          );

    $list.innerHTML = filteredUsers
      .map(
        (user) => `
        <li class="dropdown-item">
          <span class="search-user" data-id="${user.id}">${user.name}</span>
        </li>
      `
      )
      .join("");

    if (filteredUsers.length === 0) {
      $list.innerHTML = "<li>Geen gebruikers gevonden</li>";
    }
  });

  // Reset to own account functionality
  if ($resetToOwnAccountBtn && $originalUserId && $originalUserName) {
    $resetToOwnAccountBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const originalUserId = $originalUserId.value;
      const originalUserName = $originalUserName.value;
      const $consumables = document.querySelector(".consumables");

      $consumables.innerHTML = "";

      const consumables = await getAllConsumables();
      consumables.forEach((consumable) => {
        if (consumable.stock <= 0) {
          renderConsumableCardDisabled(
            consumable,
            $consumables,
            originalUserId
          );
        } else {
          renderConsumableCard(consumable, $consumables, originalUserId);
        }
      });

      InitShoppingCart();

      $loggedInUser.value = originalUserId;
      $userIdOrder.forEach(($userId) => {
        $userId.value = originalUserId;
      });

      if ($selectedUserName) {
        $selectedUserName.textContent = originalUserName;
      }

      $dropdownMenu.classList.add("hidden");
    });
  }

  document.addEventListener("click", function (e) {
    if (
      $dropdownMenu &&
      !$dropdownMenu.contains(e.target) &&
      !$button.contains(e.target)
    ) {
      $dropdownMenu.classList.add("hidden");
    }
  });
}
