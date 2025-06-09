import { getShowNotification } from "../utils/notifications.js";

export function createNotification() {
  const newNotificationForm = document.getElementById("newNotificationForm");
  const recipientTypeSelect = document.getElementById("recipient_type");
  const userSelectionField = document.getElementById("user_selection_field");
  const selectedUserSelect = document.getElementById("selected_user");
  const sendButton = document.getElementById("send_notification_btn");

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();

      while (selectedUserSelect.options.length > 1) {
        selectedUserSelect.remove(1);
      }

      users.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.firstname} ${user.lastname} (${user.email})`;
        selectedUserSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading users:", error);
      getShowNotification()(
        "Fout bij laden",
        "Er is een probleem opgetreden bij het laden van gebruikers.",
        "error"
      );
    }
  };

  if (recipientTypeSelect) {
    recipientTypeSelect.addEventListener("change", function () {
      const isPersonal = this.value === "single";

      if (isPersonal) {
        userSelectionField.style.display = "block";
        selectedUserSelect.required = true;
        sendButton.textContent = "Versturen naar geselecteerde gebruiker";
        loadUsers();
      } else {
        userSelectionField.style.display = "none";
        selectedUserSelect.required = false;
        sendButton.textContent = "Versturen naar alle gebruikers";
      }
    });
  }

  if (newNotificationForm) {
    newNotificationForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const notificationData = {
        title: document.getElementById("new_title").value,
        message: document.getElementById("new_message").value,
        recipient_type: document.getElementById("recipient_type").value,
      };

      if (notificationData.recipient_type === "single") {
        const selectedUserId = document.getElementById("selected_user").value;
        if (!selectedUserId) {
          getShowNotification()(
            "Validatiefout",
            "Selecteer een gebruiker voor persoonlijke notificatie.",
            "warning"
          );
          return;
        }
        notificationData.selected_user = selectedUserId;
      }

      try {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        });

        if (response.ok) {
          const result = await response.json();
          newNotificationForm.reset();

          userSelectionField.style.display = "none";
          selectedUserSelect.required = false;
          sendButton.textContent = "Versturen naar alle gebruikers";

          getShowNotification()(
            "Notificatie verstuurd",
            result.message,
            "success"
          );
        } else {
          const errorData = await response.json();
          getShowNotification()(
            "Fout bij versturen",
            errorData.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error creating notification:", error);
        getShowNotification()(
          "Fout bij versturen",
          "Er is een probleem opgetreden bij het versturen van de notificatie.",
          "error"
        );
      }
    });
  }
}
