import { attachSelectionListeners } from "./player-selection.js";

const originalUsersContent = {};

const setupMatchUserSearch = () => {
  const matchBlocks = document.querySelectorAll(".wedstrijd-blok");

  matchBlocks.forEach((block) => {
    const matchId = block
      .querySelector(".attendance-button")
      ?.getAttribute("data-match-id");
    if (!matchId) return;

    const otherUsersContainer = block.querySelector(".other-users");
    if (otherUsersContainer) {
      originalUsersContent[matchId] = otherUsersContainer.innerHTML;
    }

    // Zoek naar het bestaande zoekveld dat in de HTML is opgenomen
    const searchInput = block.querySelector(".match-user-search-input");
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener("input", (event) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleUserSearch(event, matchId, block);
      }, 300);
    });
  });
};

const handleUserSearch = async (event, matchId, matchBlock) => {
  const searchTerm = event.target.value.toLowerCase().trim();
  const otherUsersContainer = matchBlock.querySelector(".other-users");

  if (!searchTerm) {
    if (originalUsersContent[matchId]) {
      otherUsersContainer.innerHTML = originalUsersContent[matchId];
      attachSelectionListeners?.();
      return;
    }
  }

  try {
    const searchEndpoint = `/api/attendance/match/${matchId}/search/${
      searchTerm || "undefined"
    }`;
    const response = await fetch(searchEndpoint);

    if (!response.ok) {
      throw new Error(
        `Error searching users: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      otherUsersContainer.innerHTML =
        '<p class="no-results">Fout bij het zoeken van spelers</p>';
      return;
    }

    if (!result.data || result.data.length === 0) {
      otherUsersContainer.innerHTML =
        '<p class="no-results">Geen spelers gevonden</p>';
      return;
    }

    const loggedInUserId = matchBlock
      .querySelector(".ingelogd-user .attendance-button")
      .getAttribute("data-user-id");

    // Dedupliceer gebruikers op basis van ID
    const uniqueUsers = result.data.reduce((acc, user) => {
      if (!acc.find((u) => u.id === user.id)) {
        acc.push(user);
      }
      return acc;
    }, []);

    const filteredUsers = uniqueUsers.filter(
      (user) => user.id.toString() !== loggedInUserId
    );

    if (filteredUsers.length === 0) {
      otherUsersContainer.innerHTML =
        '<p class="no-results">Geen andere spelers gevonden</p>';
      return;
    }

    otherUsersContainer.innerHTML = "";

    filteredUsers.forEach((user) => {
      let attendance = null;
      if (user.attendance) {
        attendance =
          Array.isArray(user.attendance) && user.attendance.length > 0
            ? user.attendance[0]
            : user.attendance.match_id?.toString() === matchId
            ? user.attendance
            : null;
      }

      const userDiv = document.createElement("div");
      userDiv.className = "user";

      const userName = document.createElement("p");
      userName.textContent = `${user.firstname} ${user.lastname}`;

      const attendanceDiv = document.createElement("div");
      attendanceDiv.className = "attendence";

      const statusP = document.createElement("p");
      statusP.className = "attendence-status";

      const statusMap = {
        available: { class: "attendence--green", text: "Beschikbaar" },
        unavailable: { class: "attendence--red", text: "Niet beschikbaar" },
        reserve: { class: "attendence--orange", text: "Reserve" },
      };

      const status = attendance?.status
        ? statusMap[attendance.status]
        : { class: "", text: "Onbekend" };

      const statusSpan = document.createElement("span");
      statusSpan.className = status.class;
      statusSpan.textContent = status.text;
      statusP.appendChild(statusSpan);

      const selectionP = document.createElement("p");
      const isSelected = attendance?.is_selected === "selected";

      const isAdmin =
        document
          .getElementById("admin-status")
          ?.getAttribute("data-is-admin") === "true" ||
        matchBlock
          .querySelector(".ingelogd-user")
          ?.getAttribute("data-is-admin") === "true";

      if (isAdmin) {
        const selectButton = document.createElement("button");
        selectButton.className = "select-player-button";
        selectButton.dataset.userId = user.id;
        selectButton.dataset.matchId = matchId;
        selectButton.dataset.isSelected = isSelected
          ? "selected"
          : "not_selected";
        selectButton.textContent = isSelected
          ? "Geselecteerd"
          : "Selecteer speler";

        selectButton.addEventListener("click", async function () {
          const currentSelection =
            selectButton.getAttribute("data-is-selected");
          const newSelection =
            currentSelection === "selected" ? "not_selected" : "selected";

          selectButton.setAttribute("data-is-selected", newSelection);
          selectButton.textContent =
            newSelection === "selected" ? "Geselecteerd" : "Selecteer speler";

          if (newSelection === "selected") {
            selectionP.classList.add("attendence--green");
          } else {
            selectionP.classList.remove("attendence--green");
          }

          try {
            const response = await fetch("/api/attendance/selection", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                match_id: parseInt(matchId, 10),
                user_id: parseInt(user.id, 10),
                is_selected: newSelection,
              }),
            });

            if (!response.ok) {
              selectButton.setAttribute("data-is-selected", currentSelection);
              selectButton.textContent =
                currentSelection === "selected"
                  ? "Geselecteerd"
                  : "Selecteer speler";

              if (currentSelection === "selected") {
                selectionP.classList.add("attendence--green");
              } else {
                selectionP.classList.remove("attendence--green");
              }
            } else {
              console.log(
                "Selection update successful, refreshing attendance..."
              );

              const loggedInUserId = matchBlock
                .querySelector(".ingelogd-user .attendance-button")
                .getAttribute("data-user-id");

              if (user.id.toString() === loggedInUserId) {
                const userSelectionText = matchBlock.querySelector(
                  `#user-selection-${matchId} .selection-text`
                );
                if (userSelectionText) {
                  userSelectionText.textContent =
                    newSelection === "selected"
                      ? "Geselecteerd"
                      : "Niet geselecteerd";

                  if (newSelection === "selected") {
                    userSelectionText.classList.add("attendence--green");
                  } else {
                    userSelectionText.classList.remove("attendence--green");
                  }
                }

                setTimeout(() => {
                  if (window.refreshAttendanceStatus) {
                    window.refreshAttendanceStatus();
                  }
                }, 1000);
              }
            }
          } catch (error) {
            console.error("Error updating selection:", error);
            selectButton.setAttribute("data-is-selected", currentSelection);
            selectButton.textContent =
              currentSelection === "selected"
                ? "Geselecteerd"
                : "Selecteer speler";
          }
        });

        selectionP.className = isSelected
          ? "selection-status attendence--green"
          : "selection-status";
        selectionP.appendChild(selectButton);
      } else {
        selectionP.className = isSelected ? "attendence--green" : "";
        selectionP.textContent = isSelected
          ? "Geselecteerd"
          : "Niet geselecteerd";
      }

      attendanceDiv.appendChild(statusP);
      attendanceDiv.appendChild(selectionP);
      userDiv.appendChild(userName);
      userDiv.appendChild(attendanceDiv);
      otherUsersContainer.appendChild(userDiv);
    });

    attachSelectionListeners?.();
  } catch {
    otherUsersContainer.innerHTML =
      '<p class="no-results">Fout bij het zoeken van spelers</p>';
  }
};

document.addEventListener("DOMContentLoaded", setupMatchUserSearch);

export default setupMatchUserSearch;
