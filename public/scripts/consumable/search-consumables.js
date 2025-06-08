import { InitShoppingCart } from "../shoppingCart.js";
import renderConsumableRow from "./consumable-table.js";
import renderConsumableCard from "./consumable-card.js";
import renderConsumableCardDisabled from "./consumable-card-disabled.js";
import { deleteConsumable } from "./delete-consumable.js";
import { editConsumable } from "./edit-consumable.js";

if (document.getElementById("consumablesTableBody")) {
  const $tableBody = document.getElementById("consumablesTableBody");
  const $searchInput = document.getElementById("searchInput-consumables");
  const $filterSelect = document.getElementById("filterSelect");

  let currentCategoryId = "";

  async function performSearch(searchTerm) {
    try {
      let consumables;

      if (currentCategoryId) {
        const response = await fetch(
          `/api/consumables/category/${currentCategoryId}`
        );
        const categoryItems = await response.json();

        if (searchTerm) {
          consumables = categoryItems.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          consumables = categoryItems;
        }
      } else {
        const response = await fetch(
          `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
        );
        consumables = await response.json();
      }

      $tableBody.innerHTML = "";

      if (!consumables || consumables.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen producten gevonden</td></tr>";
        return;
      }

      consumables.forEach((consumable) => {
        renderConsumableRow(consumable, $tableBody);
      });
      deleteConsumable();
      editConsumable();
    } catch (error) {
      console.error("Fout bij het ophalen van producten:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van producten</td></tr>";
    }
  }

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    await performSearch(searchTerm);
  });

  $filterSelect.addEventListener("change", async (event) => {
    currentCategoryId = event.target.value;
    const searchTerm = $searchInput.value.toLowerCase();
    await performSearch(searchTerm);
  });
}

if (document.querySelector(".consumables")) {
  const $consumablesContainer = document.querySelector(".consumables");
  const $searchInput = document.getElementById("searchInput-consumables");
  const $filterSelect = document.getElementById("filterSelect");
  const userId = document.getElementById("logged-in-user").value;

  let currentCategoryId = "";

  async function performConsumableSearch(searchTerm) {
    try {
      let consumables;

      if (currentCategoryId) {
        const response = await fetch(
          `/api/consumables/category/${currentCategoryId}`
        );
        const categoryItems = await response.json();

        if (searchTerm) {
          consumables = categoryItems.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          consumables = categoryItems;
        }
      } else {
        const response = await fetch(
          `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
        );
        consumables = await response.json();
      }

      $consumablesContainer.innerHTML = "";
      if (!consumables || consumables.length === 0) {
        $consumablesContainer.innerHTML = "<p>Geen producten gevonden</p>";
        return;
      }

      consumables.forEach((consumable) => {
        if (consumable.stock === 0) {
          renderConsumableCardDisabled(
            consumable,
            $consumablesContainer,
            userId
          );
        } else {
          renderConsumableCard(consumable, $consumablesContainer, userId);
        }
      });

      InitShoppingCart();
    } catch (error) {
      console.error("Fout bij het ophalen van producten:", error);
      $consumablesContainer.innerHTML =
        "<p>Fout bij het ophalen van producten</p>";
    }
  }

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    await performConsumableSearch(searchTerm);
  });

  $filterSelect.addEventListener("change", async (event) => {
    currentCategoryId = event.target.value;
    const searchTerm = $searchInput.value.toLowerCase();
    await performConsumableSearch(searchTerm);
  });
}
