document.addEventListener("DOMContentLoaded", function () {
  let deleteMatchModalContainer = document.createElement("div");
  deleteMatchModalContainer.id = "delete-match-modal-container";
  document.body.appendChild(deleteMatchModalContainer);

  const deleteMatchModalHTML = `
    <div id="deleteMatchModal" class="modal hidden">
      <div class="modal-content">
        <span class="close">&times;</span>
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

  // Add event listeners to delete buttons
  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const matchId = this.getAttribute("data-id");
        deleteMatchIdInput.value = matchId;
        deleteModal.classList.remove("hidden");
      });
    });
  }

  // Close modal when clicking close button
  if (closeDeleteBtn) {
    closeDeleteBtn.addEventListener("click", function () {
      deleteModal.classList.add("hidden");
    });
  }

  // Close modal when clicking cancel button
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", function () {
      deleteModal.classList.add("hidden");
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === deleteModal) {
      deleteModal.classList.add("hidden");
    }
  });

  // Handle form submission
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
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Fout: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting match:", error);
        alert(
          "Er is een probleem opgetreden bij het verwijderen van de wedstrijd."
        );
      }
    });
  }
});
