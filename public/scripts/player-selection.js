const updateSelectionButtonAppearance = (button, isSelected) => {
  const statusText =
    isSelected === "selected" ? "Geselecteerd" : "Selecteer speler";
  button.textContent = statusText;

  const parentElement = button.closest(".selection-status");
  if (isSelected === "selected") {
    parentElement.classList.add("attendence--green");
  } else {
    parentElement.classList.remove("attendence--green");
  }

  button.setAttribute("data-is-selected", isSelected);
};

const initializeButtonAppearance = () => {
  const selectPlayerButtons = document.querySelectorAll(
    ".select-player-button"
  );
  selectPlayerButtons.forEach((button) => {
    const currentSelection = button.getAttribute("data-is-selected");
    updateSelectionButtonAppearance(button, currentSelection);
  });
};

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
      console.error("Failed to update player selection");
      return null;
    }
  } catch (error) {
    console.error("Error updating player selection:", error);
    return null;
  }
};

const attachSelectionListeners = () => {
  const selectPlayerButtons = document.querySelectorAll(
    ".select-player-button"
  );

  selectPlayerButtons.forEach((button) => {
    // Remove any existing event listeners first to prevent duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener("click", async function () {
      const currentSelection = newButton.getAttribute("data-is-selected");
      const matchId = newButton.getAttribute("data-match-id");
      const userId = newButton.getAttribute("data-user-id");

      if (!matchId || !userId) {
        console.error("Missing match ID or user ID");
        return;
      }

      const newSelection =
        currentSelection === "selected" ? "not_selected" : "selected";

      updateSelectionButtonAppearance(newButton, newSelection);

      const result = await updatePlayerSelection(matchId, userId, newSelection);

      if (!result || !result.success) {
        console.error("Failed to update player selection");
        updateSelectionButtonAppearance(newButton, currentSelection);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  initializeButtonAppearance();
  attachSelectionListeners();
});

export { attachSelectionListeners };
