import { getShowNotification } from "../utils/notifications.js";

import getAllUsers from "./getAllUsers.js";
import renderGuestUserRow from "./user-table.js";
import { createUser } from "./create-user.js";
import { deleteUser } from "./delete-user.js";
import { editUser } from "./edit-user.js";

export function createGuestUser() {
  let $newGuestUserModalContainer = document.createElement("div");
  $newGuestUserModalContainer.id = "new-guest-user-modal-container";
  document.body.appendChild($newGuestUserModalContainer);

  const newGuestUserModalHTML = `
    <div id="newGuestUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewModal"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Nieuwe gebruiker toevoegen</h2>
        <form id="newGuestUserForm">
          <div>
            <label for="new_firstname">Voornaam</label>
            <input type="text" id="new_guest_firstname" name="firstname" required>
          </div>

          <div>
            <label for="new_lastname">Achternaam</label>
            <input type="text" id="new_guest_lastname" name="lastname" required>
          </div>

          <button type="submit" class="btn btn--primary">Toevoegen</button>
        </form>
      </div>
    </div>
  `;

  $newGuestUserModalContainer.innerHTML = newGuestUserModalHTML;

  const $newGuestUserModal = document.getElementById("newGuestUserModal");
  const $addNewGuestUserBtn = document.getElementById("addNewGuestUser");
  const $closeNewModalBtn = document.getElementById("closeNewModal");
  const $newGuestUserForm = document.getElementById("newGuestUserForm");

  if ($addNewGuestUserBtn) {
    $addNewGuestUserBtn.addEventListener("click", function () {
      $newGuestUserModal.classList.remove("hidden");
    });
  }

  if ($closeNewModalBtn) {
    $closeNewModalBtn.addEventListener("click", function () {
      $newGuestUserModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === newGuestUserModal) {
      newGuestUserModal.classList.add("hidden");
    }
  });

  if ($newGuestUserForm) {
    $newGuestUserForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const userData = {
        firstname: document.getElementById("new_guest_firstname").value,
        lastname: document.getElementById("new__guest_lastname").value,
        email: "",
        password: "",
        role_id: 3,
        receive_notifications: false,
      };

      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          $newGuestUserModal.classList.add("hidden");
          getShowNotification()(
            "Gastgebruiker toegevoegd",
            "De nieuwe gastgebruiker is succesvol toegevoegd.",
            "success"
          );

          const users = await getAllUsers();
          const $tableBody = document.querySelector("#userTableBody");
          $tableBody.innerHTML = "";
          users.forEach((user) => {
            renderGuestUserRow(user, $tableBody);
          });
          createUser();
          createGuestUser();
          editUser();
          deleteUser();
        } else {
          const errorData = await response.json();
          getShowNotification()(
            "Fout bij aanmaken",
            errorData.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error creating user:", error);
        getShowNotification()(
          "Fout bij aanmaken",
          "Er is een probleem opgetreden bij het aanmaken van de gastgebruiker.",
          "error"
        );
      }
    });
  }
}
