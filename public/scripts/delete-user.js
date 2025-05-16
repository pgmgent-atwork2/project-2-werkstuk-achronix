document.addEventListener("DOMContentLoaded", function () {
  let deleteUserModalContainer = document.createElement("div");
  deleteUserModalContainer.id = "delete-user-modal-container";
  document.body.appendChild(deleteUserModalContainer);

  const deleteUserModalHTML = `
    <div id="deleteUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close">&times;</span>
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

  // Add event listeners to delete buttons
  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        deleteUserIdInput.value = userId;
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
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Fout: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(
          "Er is een probleem opgetreden bij het verwijderen van de gebruiker."
        );
      }
    });
  }
});
