import { InitShoppingCart } from "../shoppingCart.js";
import renderConsumableRow from "./consumable-table.js";
import renderConsumableCard from "./consumable-card.js";
import renderConsumableCardDisabled from "./consumable-card-disabled.js";
import { deleteConsumable } from "./delete-consumable.js";
import {editConsumable} from "./edit-consumable.js";

if (document.getElementById("consumablesTableBody")) {
  const $tableBody = document.getElementById("consumablesTableBody");

  const $searchInput = document.getElementById("searchInput-consumables");

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
      );
      const consumables = await response.json();

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
  });

  const $filterSelect = document.getElementById("filterSelect");

  $filterSelect.addEventListener("change", async (event) => {
    const categoryId = event.target.value;

    try {
      const response = await fetch(
        `/api/consumables/category/${categoryId ? categoryId : undefined}`
      );

      const consumables = await response.json();

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
  });
}

if (document.querySelector(".consumables")) {
  const $consumablesContainer = document.querySelector(".consumables");
  const $searchInput = document.getElementById("searchInput-consumables");
  const userId = document.getElementById("logged-in-user").value;

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
      );
      const consumables = await response.json();

      $consumablesContainer.innerHTML = "";
      if (!consumables || consumables.length === 0) {
        $consumablesContainer.innerHTML = "<p>Geen producten gevonden</p>";
        return;
      }

      consumables.forEach((consumable) => {
        if (consumable.stock === 0) {
          renderConsumableCardDisabled(consumable, $consumablesContainer, userId);
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
  });

  const $filterSelect = document.getElementById("filterSelect");
  $filterSelect.addEventListener("change", async (event) => {
    const categoryId = event.target.value;

    try {
      const response = await fetch(
        `/api/consumables/category/${categoryId ? categoryId : undefined}`
      );
      const consumables = await response.json();
      $consumablesContainer.innerHTML = "";
      if (!consumables || consumables.length === 0) {
        $consumablesContainer.innerHTML = "<p>Geen producten gevonden</p>";
        return;
      }
      consumables.forEach((consumable) => {
        if (consumable.stock === 0) {
          renderConsumableCardDisabled(consumable, $consumablesContainer,userId);
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
  });
}
