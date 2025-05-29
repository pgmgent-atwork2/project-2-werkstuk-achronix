const attendanceButtons = document.querySelectorAll(".attendance-button");

// Helper function to load current attendance status for all buttons when the page loads
const loadAttendanceStatuses = async () => {
  try {
    // Get all match buttons
    attendanceButtons.forEach(async (button) => {
      const matchId = button.getAttribute("data-match-id");
      const userId = button.getAttribute("data-user-id");

      if (matchId && userId) {
        try {
          const response = await fetch(
            `/api/attendance/match/${matchId}/user/${userId}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
              const status = data.data[0].status;
              updateButtonAppearance(button, status);
            }
          }
        } catch (error) {
          console.error("Error loading attendance status:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error loading attendance statuses:", error);
  }
};

// Helper function to update button appearance based on status
const updateButtonAppearance = (button, status) => {
  // Remove all status classes first
  button.classList.remove(
    "status-unknown",
    "status-available",
    "status-unavailable",
    "status-reserve"
  );

  // Update button appearance based on status
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
    default:
      button.innerHTML = '<i class="fas fa-question"></i>';
      button.classList.add("status-unknown");
  }

  // Update data attribute
  button.setAttribute("data-status", status);
};

// Helper function to update attendance status via API
const updateAttendanceStatus = async (matchId, userId, status) => {
  try {
    // Convert matchId and userId to integers
    const matchIdInt = parseInt(matchId, 10);
    const userIdInt = parseInt(userId, 10);

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
      return await response.json();
    } else {
      console.error(
        "Failed to update attendance status:",
        await response.text()
      );
      return null;
    }
  } catch (error) {
    console.error("Error updating attendance status:", error);
    return null;
  }
};

// Add click event listener to each attendance button
attendanceButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    // Get the current status
    const currentStatus = button.getAttribute("data-status");
    const matchId = button.getAttribute("data-match-id");
    const userId = button.getAttribute("data-user-id");

    if (!matchId || !userId) {
      console.error("Missing match ID or user ID");
      return;
    }

    let newStatus;

    // Cycle through statuses: unknown (?) -> available (✓) -> unavailable (✗) -> reserve (R) -> unknown (?)
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
        newStatus = "unknown";
    }

    // Update button appearance immediately for responsive UI
    updateButtonAppearance(button, newStatus);

    // Send API request to update the status
    const result = await updateAttendanceStatus(matchId, userId, newStatus);

    // If API call fails, revert to previous status
    if (!result || !result.success) {
      console.error("Failed to update attendance status");
      updateButtonAppearance(button, currentStatus);
    }
  });
});

// Load attendance statuses when the page loads
document.addEventListener("DOMContentLoaded", loadAttendanceStatuses);
