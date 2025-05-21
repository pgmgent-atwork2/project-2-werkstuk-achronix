const attendanceButtons = document.querySelectorAll(".attendance-button");

attendanceButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Get the current status
    const currentStatus = button.getAttribute("data-status");
    let newStatus;

    // Log the current status to help debug
    console.log("Current status:", currentStatus);

    // Cycle through statuses: unknown (?) -> available (✓)  -> unavailable (✗) -> reserve (R) -> unknown (?)
    switch (currentStatus) {
      case "unknown":
        newStatus = "available";
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.remove("status-unknown");
        button.classList.add("status-available");
        break;
      case "available":
        newStatus = "unavailable";
        button.innerHTML = '<i class="fas fa-times"></i>';
        button.classList.remove("status-available");
        button.classList.add("status-unavailable");
        break;
      case "unavailable":
        newStatus = "reserve";
        button.innerHTML = '<i class="fas fa-sync-alt"></i>';
        button.classList.remove("status-unavailable");
        button.classList.add("status-reserve");
        break;
      case "reserve":
        newStatus = "unknown";
        button.innerHTML = '<i class="fas fa-question"></i>';
        button.classList.remove("status-reserve");
        button.classList.add("status-unknown");
        break;
      default:
        // If no valid status is found, reset to unknown
        newStatus = "unknown";
        button.innerHTML = '<i class="fas fa-question"></i>';
        // Remove all status classes first
        button.classList.remove(
          "status-available",
          "status-reserve",
          "status-unavailable"
        );
        button.classList.add("status-unknown");
    }

    // Update data attribute
    button.setAttribute("data-status", newStatus);
  });
});
