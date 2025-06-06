function showNotification(title, message, type = "info", duration = 5000) {
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const notification = document.createElement("div");
  const notificationId =
    "notification-" + Math.random().toString(36).substr(2, 9);

  notification.id = notificationId;
  notification.className = `notification notification--${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "polite");

  notification.innerHTML = `
    <div class="notification__content">
      <div class="notification__icon">
        ${getNotificationIcon(type)}
      </div>
      <div class="notification__text">
        <div class="notification__title">${escapeHtml(title)}</div>
        <div class="notification__message">${escapeHtml(message)}</div>
      </div>
      <button class="notification__close" onclick="closeNotification('${notificationId}')" aria-label="Sluiten">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="notification__progress notification__progress--${type}"></div>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("notification--show");
  }, 10);

  if (duration > 0) {
    const progressBar = notification.querySelector(".notification__progress");
    if (progressBar) {
      progressBar.style.animationDuration = `${duration}ms`;
      progressBar.classList.add("notification__progress--active");
    }

    setTimeout(() => {
      closeNotification(notificationId);
    }, duration);
  }

  return notificationId;
}

function closeNotification(notificationId) {
  const notification = document.getElementById(notificationId);
  if (notification) {
    notification.classList.add("notification--hide");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

function closeAllNotifications() {
  const container = document.getElementById("notification-container");
  if (container) {
    const notifications = container.querySelectorAll(".notification");
    notifications.forEach((notification) => {
      closeNotification(notification.id);
    });
  }
}

function getNotificationIcon(type) {
  const icons = {
    success: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `,
    error: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `,
    warning: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    `,
    info: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    `,
  };

  return icons[type] || icons.info;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const notifications = {
  success: (title, message, duration) =>
    showNotification(title, message, "success", duration),
  error: (title, message, duration) =>
    showNotification(title, message, "error", duration),
  warning: (title, message, duration) =>
    showNotification(title, message, "warning", duration),
  info: (title, message, duration) =>
    showNotification(title, message, "info", duration),
};

window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.closeAllNotifications = closeAllNotifications;
window.notifications = notifications;
