const attendanceButtons = document.querySelectorAll(".attendance-button");

let refreshInterval;

const startPeriodicRefresh = () => {
  console.log(
    "Starting periodic refresh for attendance and selection status..."
  );

  // Refresh every 30 seconds
  refreshInterval = setInterval(() => {
    console.log("Periodic refresh triggered");
    loadAttendanceStatuses();
  }, 30000);
};

const stopPeriodicRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

const loadAttendanceStatuses = async () => {
  console.log("Loading attendance statuses...");

  try {
    // Use for...of loop instead of forEach for async operations
    for (const button of attendanceButtons) {
      const matchId = button.getAttribute("data-match-id");
      const userId = button.getAttribute("data-user-id");

      if (matchId && userId) {
        try {
          console.log(
            `Loading attendance for user ${userId}, match ${matchId}`
          );

          const response = await fetch(
            `/api/attendance/match/${matchId}/user/${userId}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
              const attendance = data.data[0];
              console.log("Attendance data received:", attendance);

              // Update button appearance with correct status
              updateButtonAppearance(button, attendance.status || "unknown");

              // Also update selection status if element exists
              const selectionTextElement = document.getElementById(
                `selection-text-${matchId}`
              );
              if (selectionTextElement) {
                const isSelected = attendance.is_selected === "selected";
                const currentText = selectionTextElement.textContent.trim();
                const newText = isSelected
                  ? "Geselecteerd"
                  : "Niet geselecteerd";

                // Only update if changed to avoid flickering
                if (currentText !== newText && currentText !== "Laden...") {
                  console.log(
                    `Selection status changed from "${currentText}" to "${newText}"`
                  );
                  selectionTextElement.textContent = newText;

                  if (isSelected) {
                    selectionTextElement.classList.add("attendence--green");
                  } else {
                    selectionTextElement.classList.remove("attendence--green");
                  }
                }

                console.log(
                  `Selection status: ${
                    isSelected ? "selected" : "not selected"
                  }`
                );
                console.log(`Attendance status: ${attendance.status}`);
              }
            } else {
              console.log("No attendance data found, setting to unknown");
              updateButtonAppearance(button, "unknown");

              // Set selection text to default
              const selectionTextElement = document.getElementById(
                `selection-text-${matchId}`
              );
              if (selectionTextElement) {
                selectionTextElement.textContent = "Niet geselecteerd";
                selectionTextElement.classList.remove("attendence--green");
              }
            }
          } else {
            console.warn(`Failed to load attendance: ${response.status}`);
            updateButtonAppearance(button, "unknown");
          }
        } catch (error) {
          console.error("Error loading attendance status:", error);
          updateButtonAppearance(button, "unknown");
        }
      }
    }
  } catch (error) {
    console.error("Error loading attendance statuses:", error);
  }
};

const updateButtonAppearance = (button, status) => {
  console.log(`Updating button appearance to: ${status}`);

  button.classList.remove(
    "status-unknown",
    "status-available",
    "status-unavailable",
    "status-reserve"
  );

  switch (status) {
    case "available":
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add("status-available");
      break;
    case "unavailable":
      button.innerHTML = '<i class="fas fa-times"></i>';
      button.classList.add("status-unavailable");
      break;
    case "reserve":
      button.innerHTML = '<i class="fas fa-sync-alt"></i>';
      button.classList.add("status-reserve");
      break;
    case "unknown":
    default:
      button.innerHTML = '<i class="fas fa-question"></i>';
      button.classList.add("status-unknown");
      break;
  }

  button.setAttribute("data-status", status);

  console.log(
    `Button updated - Status: ${status}, Classes: ${button.className}, Icon: ${button.innerHTML}`
  );
};

const updateAttendanceStatus = async (matchId, userId, status) => {
  try {
    const matchIdInt = parseInt(matchId, 10);
    const userIdInt = parseInt(userId, 10);

    console.log(
      `Updating attendance status to: ${status} for user ${userIdInt}, match ${matchIdInt}`
    );

    const response = await fetch("/api/attendance/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match_id: matchIdInt,
        user_id: userIdInt,
        status,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Attendance update successful:", result);
      return result;
    } else {
      console.error("Failed to update attendance status", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error updating attendance status:", error);
    return null;
  }
};

attendanceButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    const currentStatus = button.getAttribute("data-status") || "unknown";
    const matchId = button.getAttribute("data-match-id");
    const userId = button.getAttribute("data-user-id");

    if (!matchId || !userId) {
      console.error("Missing match ID or user ID");
      return;
    }

    let newStatus;

    switch (currentStatus) {
      case "unknown":
        newStatus = "available";
        break;
      case "available":
        newStatus = "unavailable";
        break;
      case "unavailable":
        newStatus = "reserve";
        break;
      case "reserve":
        newStatus = "unknown";
        break;
      default:
        newStatus = "available";
    }

    console.log(`Changing status from ${currentStatus} to ${newStatus}`);

    updateButtonAppearance(button, newStatus);

    const result = await updateAttendanceStatus(matchId, userId, newStatus);

    if (!result || !result.success) {
      console.error("Failed to update attendance status");
      updateButtonAppearance(button, currentStatus);
    } else {
      console.log("Attendance status updated successfully");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing attendance...");

  setTimeout(() => {
    loadAttendanceStatuses();

    setTimeout(() => {
      startPeriodicRefresh();
    }, 5000); 
  }, 200);
});

window.addEventListener("beforeunload", () => {
  stopPeriodicRefresh();
});

window.addEventListener("focus", () => {
  console.log("Window gained focus, refreshing attendance status...");
  loadAttendanceStatuses();
});

window.refreshAttendanceStatus = loadAttendanceStatuses;
