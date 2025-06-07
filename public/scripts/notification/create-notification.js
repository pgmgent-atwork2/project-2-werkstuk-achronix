import { getShowNotification } from "../utils/notifications.js";

export function createNotification() {
  const newNotificationForm = document.getElementById("newNotificationForm");

  if (newNotificationForm) {
    newNotificationForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const notificationData = {
        title: document.getElementById("new_title").value,
        message: document.getElementById("new_message").value,
      };

      try {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        });

        if (response.ok) {
          newNotificationForm.reset();

          getShowNotification()(
            "Notificatie verstuurd",
            "De notificatie is succesvol verstuurd naar alle gebruikers.",
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
