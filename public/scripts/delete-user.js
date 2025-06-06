document.addEventListener("DOMContentLoaded", function () {
  let deleteUserModalContainer = document.createElement("div");
  deleteUserModalContainer.id = "delete-user-modal-container";
  document.body.appendChild(deleteUserModalContainer);

   let showNotification = window.showNotification || function (title, message, type) {
    alert(`${type.toUpperCase()}: ${title} - ${message}`);
  };


  const deleteUserModalHTML = `
    <div id="deleteUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Gebruiker verwijderen</h2>
        <p>Weet je zeker dat je deze gebruiker wilt verwijderen?</p>
        <form id="deleteUserForm">
          <input type="hidden" id="deleteUserId" name="deleteUserId">
          <div class="button-group">
            <button type="button" id="cancelDeleteUser" class="btn btn--secondary">Annuleren</button>
            <button type="submit" class="btn btn--danger">Verwijderen</button>
          </div>
        </form>
      </div>
    </div>
  `;

  deleteUserModalContainer.innerHTML = deleteUserModalHTML;

  const deleteModal = document.getElementById("deleteUserModal");
  const deleteButtons = document.querySelectorAll(".delete-user");
  const closeDeleteBtn = document.querySelector("#deleteUserModal .close");
  const cancelDeleteBtn = document.getElementById("cancelDeleteUser");
  const deleteUserForm = document.getElementById("deleteUserForm");
  const deleteUserIdInput = document.getElementById("deleteUserId");

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        deleteUserIdInput.value = userId;
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

  if (deleteUserForm) {
    deleteUserForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const userId = deleteUserIdInput.value;

      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

       if (response.ok) {
        deleteModal.classList.add("hidden");
        showNotification(
          "Gebruiker verwijderd",
          "De gebruiker is succesvol verwijderd.",
          "success"
        );
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await response.json();
        showNotification("Fout bij verwijderen", errorData.message, "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification(
        "Fout bij verwijderen",
        "Er is een probleem opgetreden bij het verwijden van de gebruiker.",
        "error"
      );
      }
    });
  }
});
