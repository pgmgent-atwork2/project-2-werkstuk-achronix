import { getShowNotification } from "./utils/notifications.js";

document.addEventListener("DOMContentLoaded", function () {
  let deleteMatchModalContainer = document.createElement("div");
  deleteMatchModalContainer.id = "delete-match-modal-container";
  document.body.appendChild(deleteMatchModalContainer);

  const deleteMatchModalHTML = `
    <div id="deleteMatchModal" class="modal hidden">
      <div class="modal-content">
        <span class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Wedstrijd verwijderen</h2>
        <p>Weet je zeker dat je deze wedstrijd wilt verwijderen?</p>
        <form id="deleteMatchForm">
          <input type="hidden" id="deleteMatchId" name="deleteMatchId">
          <div class="button-group">
            <button type="button" id="cancelDelete" class="btn btn--secondary">Annuleren</button>
            <button type="submit" class="btn btn--danger">Verwijderen</button>
          </div>
        </form>
      </div>
    </div>
  `;

  deleteMatchModalContainer.innerHTML = deleteMatchModalHTML;

  const deleteModal = document.getElementById("deleteMatchModal");
  const deleteButtons = document.querySelectorAll(".delete-match");
  const closeDeleteBtn = document.querySelector("#deleteMatchModal .close");
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  const deleteMatchForm = document.getElementById("deleteMatchForm");
  const deleteMatchIdInput = document.getElementById("deleteMatchId");

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const matchId = this.getAttribute("data-id");
        deleteMatchIdInput.value = matchId;
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

  if (deleteMatchForm) {
    deleteMatchForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const matchId = deleteMatchIdInput.value;

      try {
        const response = await fetch(`/api/matches/${matchId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          deleteModal.classList.add("hidden");
          getShowNotification()(
            "Wedstrijd verwijderd",
            "Deze wedstrijd is succesvol verwijderd.",
            "success"
          );
          setTimeout(() => window.location.reload(), 1500);
        } else {
          const errorData = await response.json();
          getShowNotification()("Fout bij het verwijderen", errorData.message, "error");
        }
      } catch (error) {
        console.error("Error removing match:", error);
        getShowNotification()(
          "Fout bij het verwijderen",
          "Er is een probleem opgetreden bij het verwijderen van de wedstrijd.",
          "error"
        );
      }
    });
  }
});
