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

// Add real-time refresh capability
const refreshUserSelectionStatus = async () => {
  await loadUserSelectionStatus();
};

// Export refresh function for use by other scripts
window.refreshUserSelectionStatus = refreshUserSelectionStatus;

const updateLoggedInUserSelection = (matchId, userId, isSelected) => {
  // Update de selectie status van de ingelogde gebruiker als die wordt geselecteerd
  const userSelectionElements = document.querySelectorAll(
    `[data-user-id="${userId}"][data-match-id="${matchId}"]`
  );

  userSelectionElements.forEach((element) => {
    if (element.classList.contains("selection-text")) {
      element.textContent =
        isSelected === "selected" ? "Geselecteerd" : "Niet geselecteerd";

      if (isSelected === "selected") {
        element.classList.add("attendence--green");
      } else {
        element.classList.remove("attendence--green");
      }
    }
  });

  setTimeout(() => {
    console.log("Triggering attendance refresh after selection update...");
    if (window.refreshAttendanceStatus) {
      window.refreshAttendanceStatus();
    }
    refreshUserSelectionStatus();
  }, 1000);
};

const attachSelectionListeners = () => {
  const selectPlayerButtons = document.querySelectorAll(
    ".select-player-button"
  );

  selectPlayerButtons.forEach((button) => {
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
      } else {
        updateLoggedInUserSelection(matchId, userId, newSelection);
      }
    });
  });
};

const loadUserSelectionStatus = async () => {

  const selectionElements = document.querySelectorAll(
    '[id^="user-selection-"]'
  );

  for (const element of selectionElements) {
    const userId = element.getAttribute("data-user-id");
    const matchId = element.getAttribute("data-match-id");
    const textElement = element.querySelector(".selection-text");

    if (userId && matchId && textElement) {
      try {
        const response = await fetch(
          `/api/attendance/match/${matchId}/user/${userId}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Selection data received:", data);

          if (data.success && data.data && data.data.length > 0) {
            const attendance = data.data[0];
            const isSelected = attendance.is_selected === "selected";

            textElement.textContent = isSelected
              ? "Geselecteerd"
              : "Niet geselecteerd";

            if (isSelected) {
              textElement.classList.add("attendence--green");
            } else {
              textElement.classList.remove("attendence--green");
            }

            console.log(
              `Updated selection status: ${
                isSelected ? "selected" : "not selected"
              }`
            );
          } else {
            textElement.textContent = "Niet geselecteerd";
            textElement.classList.remove("attendence--green");
          }
        } else {
          console.error(`Failed to load selection status: ${response.status}`);
          textElement.textContent = "Niet geselecteerd";
        }
      } catch (error) {
        console.error("Error loading selection status:", error);
        textElement.textContent = "Niet geselecteerd";
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {

  setTimeout(() => {
    initializeButtonAppearance();
    attachSelectionListeners();

    setTimeout(() => {
      loadUserSelectionStatus();
    }, 100);

    setTimeout(() => {
      setInterval(() => {
        refreshUserSelectionStatus();
      }, 45000); 
    }, 10000);
  }, 300);
});

export { attachSelectionListeners };
