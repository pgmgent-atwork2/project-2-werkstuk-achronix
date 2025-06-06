import { getShowNotification } from "../utils/notifications.js";

import renderConsumableRow from "./consumable-table.js";
import getAllConsumables from "../getAllConsumables.js";
import { deleteConsumable } from "./delete-consumable.js";
import { editConsumable } from "./edit-consumable.js";

export function createConsumable() {
  let $newConsumableModalContainer = document.createElement("div");
  $newConsumableModalContainer.id = "new-consumable-modal-container";
  document.body.appendChild($newConsumableModalContainer);

  const newConsumableHTML = `
    <div id="newConsumableModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </span>
        <h2>Nieuw product toevoegen</h2>
        <form id="newConsumableForm" enctype="multipart/form-data">
          <div>
            <label for="new_name">Naam</label>
            <input type="text" id="new_name" name="name" required>
          </div>

        
          <div>
            <label for="new_price">Prijs</label>
            <input type="number" id="new_price" name="price" step="0.01" min="0" required>
          </div>

          <div>
            <label for="new_stock">Voorraad</label>
            <input type="number" id="new_stock" name="stock" step="1" min="0" required>
          </div>

          <div>
            <label for="new_image">Afbeelding uploaden</label>
            <input type="file" id="new_image" name="image" accept="image/*" required>
            <img id="new_image_preview" src="" alt="Image preview" class="hidden">
          </div>

          <div>
            <label for="new_category">Categorie</label>
            <select id="new_category" name="category" required>
              <option value="2">Drank</option>
              <option value="1">Eten</option>
            </select>
          </div>

          <button type="submit" class="btn btn--primary">Toevoegen</button>
        </form>
      </div>
    </div>
  `;

  $newConsumableModalContainer.innerHTML = newConsumableHTML;

  const $newConsumableModal = document.getElementById("newConsumableModal");
  const $addNewConsumableBtn = document.getElementById("addNewConsumable");
  const $closeNewModalBtn = document.getElementById("closeNewModal");
  const $newConsumableForm = document.getElementById("newConsumableForm");

  if ($addNewConsumableBtn) {
    $addNewConsumableBtn.addEventListener("click", function () {
      $newConsumableModal.classList.remove("hidden");
    });
  }

  if ($closeNewModalBtn) {
    $closeNewModalBtn.addEventListener("click", function () {
      $newConsumableModal.classList.add("hidden");
    });
  }

  const $newImage = document.getElementById("new_image");

  $newImage.addEventListener("change", function () {
    const file = $newImage.files[0];
    const $newImagePreview = document.getElementById("new_image_preview");

    if (file) {
      $newImagePreview.src = URL.createObjectURL(file);
      $newImagePreview.classList.remove("hidden");
    } else {
      $newImagePreview.src = "";
      $newImagePreview.classList.add("hidden");
    }
  });

  window.addEventListener("click", function (event) {
    if (event.target === $newConsumableModal) {
      $newConsumableModal.classList.add("hidden");
    }
  });

  if ($newConsumableForm) {
    $newConsumableForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData($newConsumableForm);

      try {
        const response = await fetch("/upload/consumable-image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          $newConsumableModal.classList.add("hidden");
          getShowNotification()(
            "Product toegevoegd",
            "product is succesvol toegevoegd.",
            "success"
          );
          const consumables = await getAllConsumables();
          const $tableBody = document.querySelector("#consumablesTableBody");
          $tableBody.innerHTML = "";
          consumables.forEach((consumable) => {
            renderConsumableRow(consumable, $tableBody);
          });
          createConsumable();
          editConsumable();
          deleteConsumable();
        } else {
          const errorData = await response.json();
          getShowNotification()("Fout bij bijwerken", errorData.message, "error");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        getShowNotification()(
          "Fout bij product toevoegen",
          "Er is een probleem opgetreden bij het toevoegen van het product.",
          "error"
        );
      }
    });
  }
}
