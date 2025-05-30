// Player selection functionality
document.addEventListener("DOMContentLoaded", function () {
  const selectPlayerButtons = document.querySelectorAll(
    ".select-player-button"
  );

  // Helper function to update button appearance and text based on selection status
  const updateSelectionButtonAppearance = (button, isSelected) => {
    const statusText =
      isSelected === "selected" ? "Geselecteerd" : "Selecteer speler";
    button.textContent = statusText;

    // Update parent element's class for styling
    const parentElement = button.closest(".selection-status");
    if (isSelected === "selected") {
      parentElement.classList.add("attendence--green");
    } else {
      parentElement.classList.remove("attendence--green");
    }

    // Update data attribute
    button.setAttribute("data-is-selected", isSelected);
  };

  // Initialize button appearance based on current data-is-selected attribute
  const initializeButtonAppearance = () => {
    selectPlayerButtons.forEach((button) => {
      const currentSelection = button.getAttribute("data-is-selected");
      updateSelectionButtonAppearance(button, currentSelection);
    });
  };

  // Call initialization on page load
  initializeButtonAppearance();

  // Helper function to update player selection via API
  const updatePlayerSelection = async (matchId, userId, isSelected) => {
    try {
      const matchIdInt = parseInt(matchId, 10);
      const userIdInt = parseInt(userId, 10);

      const response = await fetch("/api/attendance/selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_id: matchIdInt,
          user_id: userIdInt,
          is_selected: isSelected,
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error(
          "Failed to update player selection:",
          await response.text()
        );
        return null;
      }
    } catch (error) {
      console.error("Error updating player selection:", error);
      return null;
    }
  };

  // Add click event listener to each select player button
  selectPlayerButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const currentSelection = button.getAttribute("data-is-selected");
      const matchId = button.getAttribute("data-match-id");
      const userId = button.getAttribute("data-user-id");

      if (!matchId || !userId) {
        console.error("Missing match ID or user ID");
        return;
      }

      // Toggle selection status
      const newSelection =
        currentSelection === "selected" ? "not_selected" : "selected";

      // Update button appearance immediately for responsive UI
      updateSelectionButtonAppearance(button, newSelection);

      // Send API request to update the selection status
      const result = await updatePlayerSelection(matchId, userId, newSelection);

      // If API call fails, revert to previous status
      if (!result || !result.success) {
        console.error("Failed to update player selection");
        updateSelectionButtonAppearance(button, currentSelection);
      }
    });
  });
});
