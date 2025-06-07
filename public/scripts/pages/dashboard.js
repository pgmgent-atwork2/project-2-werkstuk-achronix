async function dismissNotification(consumableId) {
  try {
    const response = await fetch(
      `/api/notifications/back-in-stock/${consumableId}/dismiss`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error("Error dismissing notification:", error);
  }
}

async function dismissAllNotifications() {
  try {
    const response = await fetch(
      "/api/notifications/back-in-stock/dismiss-all",
      {
        method: "POST",
      }
    );

    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error("Error dismissing all notifications:", error);
  }
}

async function dismissAdminNotification(notificationId) {
  try {
    console.log("Dismissing admin notification:", notificationId);

    const response = await fetch(
      `/api/notifications/${notificationId}/dismiss`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      console.log("Successfully dismissed notification");

      const notificationElement = document.querySelector(
        `[data-admin-notification-id="${notificationId}"]`
      );

      if (notificationElement) {
        notificationElement.remove();
        console.log("Removed notification element from DOM");
      }

      const remainingNotifications = document.querySelectorAll(
        "[data-admin-notification-id]"
      );

      if (remainingNotifications.length === 0) {
        const notificationSection = document.querySelector(
          ".notifications-section"
        );
        if (
          notificationSection &&
          notificationSection.querySelector("[data-admin-notification-id]")
        ) {
          notificationSection.remove();
        }
      } else {
        const dismissAllButton = document.querySelector(
          'button[onclick="dismissAllAdminNotifications()"]'
        );
        if (dismissAllButton) {
          if (remainingNotifications.length === 1) {
            dismissAllButton.textContent = "Bericht verwijderen";
          } else {
            dismissAllButton.textContent = "Alle berichten wegvegen";
          }
        }
      }
    } else {
      console.error("Failed to dismiss notification:", response.status);
    }
  } catch (error) {
    console.error("Error dismissing admin notification:", error);
  }
}

async function dismissAllAdminNotifications() {
  try {
    console.log("Dismissing all admin notifications");

    const response = await fetch(
      "/api/notifications/admin-message/dismiss-all",
      {
        method: "POST",
      }
    );

    if (response.ok) {
      console.log("Successfully dismissed all admin notifications");
      location.reload();
    } else {
      console.error("Failed to dismiss all notifications:", response.status);
    }
  } catch (error) {
    console.error("Error dismissing all admin notifications:", error);
  }
}

// Make functions globally available
window.dismissNotification = dismissNotification;
window.dismissAllNotifications = dismissAllNotifications;
window.dismissAdminNotification = dismissAdminNotification;
window.dismissAllAdminNotifications = dismissAllAdminNotifications;

// Debug info
console.log("Dashboard.js loaded, functions available:", {
  dismissNotification: typeof window.dismissNotification,
  dismissAllNotifications: typeof window.dismissAllNotifications,
  dismissAdminNotification: typeof window.dismissAdminNotification,
  dismissAllAdminNotifications: typeof window.dismissAllAdminNotifications,
});
