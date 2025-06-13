import { getShowNotification } from "../utils/notifications.js";
import getAllUsers from "./getAllUsers.js";
import renderUserRow from "./user-table.js";
import { deleteUser } from "./delete-user.js";

export function editUser() {
  let $editModalContainer = document.createElement("div");
  $editModalContainer.id = "edit-modal-container";
  document.body.appendChild($editModalContainer);

  const editUserModalHTML = `
    <div id="editUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Gebruiker bewerken</h2>
        <form id="editUserForm">
          <input type="hidden" id="userId" name="userId">

          <div>
            <label for="firstname">Voornaam</label>
            <input type="text" id="firstname" name="firstname" required>
          </div>

          <div>
            <label for="lastname">Achternaam</label>
            <input type="text" id="lastname" name="lastname" required>
          </div>

          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>

         <div>
            <label for="edit_type">Type</label>
            <select id="edit_type" name="type">
              <option value="2" id="new_is_admin">Gebruiker</option>
              <option value="3">gast</option>
              <option value="1">Beheerder</option>
            </select>
          </div>

          <div>
            <label for="receive_notifications">Email notificaties ontvangen</label>
            <input type="checkbox" id="receive_notifications" name="receive_notifications">
          </div>

          <div>
            <label for="password">Nieuw wachtwoord (leeg laten om niet te wijzigen)</label>
            <input type="password" id="password" name="password">
          </div>

          <button type="submit" class="btn btn--primary">Opslaan</button>
        </form>
      </div>
    </div>
  `;

  $editModalContainer.innerHTML = editUserModalHTML;

  const $modal = document.getElementById("editUserModal");
  const $editButtons = document.querySelectorAll(".edit-user");
  const $closeBtn = document.querySelector("#editUserModal .close");
  const $userIdInput = document.getElementById("userId");
  const $firstnameInput = document.getElementById("firstname");
  const $lastnameInput = document.getElementById("lastname");
  const $emailInput = document.getElementById("email");
  const $TypeInput = document.getElementById("edit_type");
  const $receiveNotificationsInput = document.getElementById(
    "receive_notifications"
  );
  const $editUserForm = document.getElementById("editUserForm");

  $editButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const userId = this.getAttribute("data-id");

      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        $userIdInput.value = userData.id;
        $firstnameInput.value = userData.firstname;
        $lastnameInput.value = userData.lastname;
        $emailInput.value = userData.email;
        $TypeInput.value = userData.role_id;
        $receiveNotificationsInput.checked = userData.receive_notifications;

        $modal.classList.remove("hidden");
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

  $closeBtn.addEventListener("click", function () {
    $modal.classList.add("hidden");
  });

  window.addEventListener("click", function (event) {
    if (event.target === $modal) {
      $modal.classList.add("hidden");
    }
  });

  $editUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = $userIdInput.value;
    const userData = {
      firstname: $firstnameInput.value,
      lastname: $lastnameInput.value,
      email: $emailInput.value,
      role_id: parseInt($TypeInput.value),
      receive_notifications: $receiveNotificationsInput.checked,
    };

    if (document.getElementById("password").value) {
      userData.password = document.getElementById("password").value;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        $modal.classList.add("hidden");
        getShowNotification()(
          "Gebruiker bijgewerkt",
          "De gebruiker is succesvol bijgewerkt.",
          "success"
        );
        const users = await getAllUsers();
        const $tableBody = document.querySelector("#userTableBody");
        $tableBody.innerHTML = "";
        users.forEach((user) => {
          renderUserRow(user, $tableBody);
        });
        editUser();
        deleteUser();
      } else {
        const errorData = await response.json();
        getShowNotification()("Fout bij bijwerken", errorData.message, "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      getShowNotification()(
        "Fout bij bijwerken",
        "Er is een probleem opgetreden bij het bijwerken van de gebruiker.",
        "error"
      );
    }
  });
}
