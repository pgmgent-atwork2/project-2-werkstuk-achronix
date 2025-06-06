import { getShowNotification } from "../utils/notifications.js";

document.addEventListener("DOMContentLoaded", function () {
  let deleteConsumableModalContainer = document.createElement("div");
  deleteConsumableModalContainer.id = "delete-consumable-modal-container";
  document.body.appendChild(deleteConsumableModalContainer);

  const deleteConsumableModalHTML = `
    <div id="deleteConsumableModal" class="modal hidden">
      <div class="modal-content">
        <span class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Product verwijderen</h2>
        <p>Weet je zeker dat je dit product wilt verwijderen?</p>
        <form id="deleteConsumableForm">
          <input type="hidden" id="deleteConsumableId" name="deleteConsumableId">
          <div class="button-group">
            <button type="button" id="cancelDeleteConsumable" class="btn btn--secondary">Annuleren</button>
            <button type="submit" class="btn btn--danger">Verwijderen</button>
          </div>
        </form>
      </div>
    </div>
  `;

  deleteConsumableModalContainer.innerHTML = deleteConsumableModalHTML;

  const deleteModal = document.getElementById("deleteConsumableModal");
  const deleteButtons = document.querySelectorAll(".delete-consumable");
  const closeDeleteBtn = document.querySelector(
    "#deleteConsumableModal .close"
  );
  const cancelDeleteBtn = document.getElementById("cancelDeleteConsumable");
  const deleteConsumableForm = document.getElementById("deleteConsumableForm");
  const deleteConsumableIdInput = document.getElementById("deleteConsumableId");

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const consumableId = this.getAttribute("data-id");
        deleteConsumableIdInput.value = consumableId;
        deleteModal.classList.remove("hidden");
      });
    });
  }

  if (closeDeleteBtn) {
    closeDeleteBtn.addEventListener("click", function () {
      deleteModal.classList.add("hidden");
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", function () {
      deleteModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === deleteModal) {
      deleteModal.classList.add("hidden");
    }
  });

  if (deleteConsumableForm) {
    deleteConsumableForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const consumableId = deleteConsumableIdInput.value;

      try {
        const response = await fetch(`/upload/consumable-image`, {
          method: "DELETE",
          body: JSON.stringify({ consumableId }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          deleteModal.classList.add("hidden");
          getShowNotification()(
            "Product is verwijderd",
            "Product is succesvol verwijderd.",
            "success"
          );
          setTimeout(() => window.location.reload(), 1500);
        } else {
          const errorData = await response.json();
          getShowNotification()("Fout bij het verwijderen", errorData.message, "error");
        }
      } catch (error) {
        console.error("Error removing product:", error);
        getShowNotification()(
          "Fout bij het verwijderen",
          "Er is een probleem opgetreden bij het verwijderen van het product.",
          "error"
        );
      }
    });
  }
});
