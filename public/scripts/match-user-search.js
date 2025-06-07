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

    const filteredUsers = result.data.filter(
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
