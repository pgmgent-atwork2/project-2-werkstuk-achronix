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

window.dismissNotification = dismissNotification;
window.dismissAllNotifications = dismissAllNotifications;
