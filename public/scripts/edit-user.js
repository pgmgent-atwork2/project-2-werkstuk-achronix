document.addEventListener("DOMContentLoaded", function () {
  let editModalContainer = document.createElement("div");
  editModalContainer.id = "edit-modal-container";
  document.body.appendChild(editModalContainer);

  let showNotification = window.showNotification || function (title, message, type) {
    alert(`${type.toUpperCase()}: ${title} - ${message}`);
  };

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
            <label for="is_admin">Admin rechten</label>
            <input type="checkbox" id="is_admin" name="is_admin">
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

  editModalContainer.innerHTML = editUserModalHTML;

  const modal = document.getElementById("editUserModal");
  const editButtons = document.querySelectorAll(".edit-user");
  const closeBtn = document.querySelector("#editUserModal .close");
  const userIdInput = document.getElementById("userId");
  const firstnameInput = document.getElementById("firstname");
  const lastnameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const isAdminInput = document.getElementById("is_admin");
  const receiveNotificationsInput = document.getElementById(
    "receive_notifications"
  );
  const editUserForm = document.getElementById("editUserForm");

  editButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const userId = this.getAttribute("data-id");

      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        userIdInput.value = userData.id;
        firstnameInput.value = userData.firstname;
        lastnameInput.value = userData.lastname;
        emailInput.value = userData.email;
        isAdminInput.checked = userData.is_admin;
        receiveNotificationsInput.checked = userData.receive_notifications;

        modal.classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification(
          "Fout bij ophalen",
          "Er is een probleem opgetreden bij het ophalen van de gebruikersgegevens.",
          "error"
        );
      }
    });
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  editUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = userIdInput.value;
    const userData = {
      firstname: firstnameInput.value,
      lastname: lastnameInput.value,
      email: emailInput.value,
      is_admin: isAdminInput.checked,
      receive_notifications: receiveNotificationsInput.checked,
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
        modal.classList.add("hidden");
        showNotification(
          "Gebruiker bijgewerkt",
          "De gebruiker is succesvol bijgewerkt.",
          "success"
        );
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await response.json();
        showNotification("Fout bij bijwerken", errorData.message, "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification(
        "Fout bij bijwerken",
        "Er is een probleem opgetreden bij het bijwerken van de gebruiker.",
        "error"
      );
    }
  });
});
