import { getShowNotification } from "./utils/notifications.js";

document.addEventListener("DOMContentLoaded", function () {
import getAllUsers from "./getAllUsers.js";
import renderUserRow from "./user-table.js";
import { deleteUser } from "./delete-user.js";
import { editUser } from "./edit-user.js";

export function createUser() {
  let newUserModalContainer = document.createElement("div");
  newUserModalContainer.id = "new-user-modal-container";
  document.body.appendChild(newUserModalContainer);

  const newUserModalHTML = `
    <div id="newUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewModal"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Nieuwe gebruiker toevoegen</h2>
        <form id="newUserForm">
          <div>
            <label for="new_firstname">Voornaam</label>
            <input type="text" id="new_firstname" name="firstname" required>
          </div>

          <div>
            <label for="new_lastname">Achternaam</label>
            <input type="text" id="new_lastname" name="lastname" required>
          </div>

          <div>
            <label for="new_email">Email</label>
            <input type="email" id="new_email" name="email" required>
          </div>

          <div>
            <label for="new_password">Wachtwoord (kan altijd opnieuw worden aangemaakt via "wachtwoord vergeten")</label>
            <input type="password" id="new_password" name="password" required>
          </div>

          <div>
            <label for="new_is_admin">Admin rechten</label>
            <input type="checkbox" id="new_is_admin" name="is_admin">
          </div>

          <div>
            <label for="new_receive_notifications">Email notificaties ontvangen</label>
            <input type="checkbox" id="new_receive_notifications" name="receive_notifications" checked>
          </div>

          <button type="submit" class="btn btn--primary">Toevoegen</button>
        </form>
      </div>
    </div>
  `;

  newUserModalContainer.innerHTML = newUserModalHTML;

  const newUserModal = document.getElementById("newUserModal");
  const addNewUserBtn = document.getElementById("addNewUser");
  const closeNewModalBtn = document.getElementById("closeNewModal");
  const newUserForm = document.getElementById("newUserForm");

  if (addNewUserBtn) {
    addNewUserBtn.addEventListener("click", function () {
      newUserModal.classList.remove("hidden");
    });
  }

  if (closeNewModalBtn) {
    closeNewModalBtn.addEventListener("click", function () {
      newUserModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === newUserModal) {
      newUserModal.classList.add("hidden");
    }
  });

  if (newUserForm) {
    newUserForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const userData = {
        firstname: document.getElementById("new_firstname").value,
        lastname: document.getElementById("new_lastname").value,
        email: document.getElementById("new_email").value,
        password: document.getElementById("new_password").value,
        is_admin: document.getElementById("new_is_admin").checked,
        receive_notifications: document.getElementById(
          "new_receive_notifications"
        ).checked,
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
          newUserModal.classList.add("hidden");
          getShowNotification()(
            "Gebruiker toegevoegd",
            "De nieuwe gebruiker is succesvol toegevoegd.",
            "success"
          );

          const users = await getAllUsers();
          const $tableBody = document.querySelector("#userTableBody");
          $tableBody.innerHTML = "";
          users.forEach((user) => {
            renderUserRow(user, $tableBody);
          });
          createUser();
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
          "Er is een probleem opgetreden bij het aanmaken van de gebruiker.",
          "error"
        );
      }
    });
  }
}
