import { getShowNotification } from "../utils/notifications.js";
import renderConsumableRow from "./consumable-table.js";
import getAllConsumables from "../getAllConsumables.js";
import { deleteConsumable } from "./delete-consumable.js";

export function editConsumable() {
  let $editConsumableModalContainer = document.createElement("div");
  $editConsumableModalContainer.id = "edit-consumable-modal-container";
  document.body.appendChild($editConsumableModalContainer);

  const editConsumableHTML = `
    <div id="editConsumableModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeEditModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </span>
        <h2>Nieuw product toevoegen</h2>
        <form id="editConsumableForm" enctype="multipart/form-data">


           <input type="hidden" id="conumableId" name="id">
          <div>
            <label for="edit_name">Naam</label>
            <input type="text" id="consumableName" name="name" required>
          </div>

          <div>
            <label for="edit_price">Prijs</label>
            <input type="number" id="consumablePrice" name="price" step="0.01" min="0" required>
          </div>

           <div>
            <label for="edit_stock">Stock</label>
            <input type="number" id="consumableStock" name="stock" step="1" min="0" required>
          </div>

          <div>
            <label for="edit_image">Afbeelding uploaden</label>
            <input type="file" id="consumableImage" name="image" accept="image/*">
            <img id="edit_image" src="" alt="Image preview">
          </div>

          <div>
            <label for="edit_category">Categorie</label>
            <select id="consumableCategory" name="category" required>
              <option value="1">Drank</option>
              <option value="2">Eten</option>
            </select>
          </div>

          <button type="submit" class="btn btn--primary">Aanpassen</button>
        </form>
      </div>
    </div>
  `;

  $editConsumableModalContainer.innerHTML = editConsumableHTML;

  const $editConsumableModal = document.getElementById("editConsumableModal");
  const $closeEditModalBtn = document.getElementById("closeEditModal");
  const $editConsumableForm = document.getElementById("editConsumableForm");
  const $consumableId = document.getElementById("conumableId");
  const $consumableName = document.getElementById("consumableName");
  const $consumablePrice = document.getElementById("consumablePrice");
  const $consumableImage = document.getElementById("consumableImage");
  const $consumableCategory = document.getElementById("consumableCategory");
  const $consumableStock = document.getElementById("consumableStock");

  const $editImage = document.getElementById("edit_image");

  const $editButtons = document.querySelectorAll(".edit-consumable");

  $editButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const consumable = this.getAttribute("data-id");

      try {
        const response = await fetch(`/api/consumables/${consumable}`);

        if (!response.ok) {
          throw new Error("Failed to fetch consumable data");
        }

        const consumableData = await response.json();

        $consumableId.value = consumableData.id;
        $consumableName.value = consumableData.name;
        $consumablePrice.value = consumableData.price;
        $consumableCategory.value = consumableData.category_id;
        $consumableStock.value = consumableData.stock;
        $editImage.src = consumableData.image_url;

        $editConsumableModal.classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching user data:", error);
        getShowNotification()(
          "Fout bij ophalen",
          "Er is een probleem opgetreden bij het ophalen van de gebruikersgegevens.",
          "error"
        );
      }
    });
  });

  if ($closeEditModalBtn) {
    $closeEditModalBtn.addEventListener("click", function () {
      $editConsumableModal.classList.add("hidden");
    });
  }

  $consumableImage.addEventListener("change", function () {
    const file = $consumableImage.files[0];

    if (file) {
      $editImage.src = URL.createObjectURL(file);
      $editImage.classList.remove("hidden");
    } else {
      $editImage.src = "";
      $editImage.classList.add("hidden");
    }
  });

  window.addEventListener("click", function (event) {
    if (event.target === $editConsumableModal) {
      $editConsumableModal.classList.add("hidden");
    }
  });

  if ($editConsumableForm) {
    $editConsumableForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData($editConsumableForm);

      try {
        const response = await fetch("/upload/consumable-image", {
          method: "PUT",
          body: formData,
        });

        if (response.ok) {
          $editConsumableModal.classList.add("hidden");
          getShowNotification()(
            "product aangepast",
            "product is succesvol aangepast.",
            "success"
          );
          const consumables = await getAllConsumables();
          const $tableBody = document.querySelector("#consumablesTableBody");
          $tableBody.innerHTML = "";
          consumables.forEach((consumable) => {
            renderConsumableRow(consumable, $tableBody);
          });
          editConsumable();
          deleteConsumable();
        } else {
          const errorData = await response.json();
          getShowNotification()(
            "Fout bij het aanpassen",
            errorData.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error updating user:", error);
        getShowNotification()(
          "Fout bij het aanpassen",
          "Er is een probleem opgetreden bij het aanpassen van het product.",
          "error"
        );
      }
    });
  }
}
