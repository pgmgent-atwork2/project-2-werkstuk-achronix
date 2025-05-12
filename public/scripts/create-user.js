document.addEventListener("DOMContentLoaded", function () {
  let newUserModalContainer = document.createElement("div");
  newUserModalContainer.id = "new-user-modal-container";
  document.body.appendChild(newUserModalContainer);

  const newUserModalHTML = `
    <div id="newUserModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewModal">&times;</span>
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

          <button type="submit" class="btn">Toevoegen</button>
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
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Fout: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        alert(
          "Er is een probleem opgetreden bij het aanmaken van de gebruiker."
        );
      }
    });
  }
});
