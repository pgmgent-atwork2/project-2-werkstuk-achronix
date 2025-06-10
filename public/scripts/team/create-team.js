import { getShowNotification } from "../utils/notifications.js";
import renderTeamRow from "./team-table.js";
import getAllTeams from "./getAllteams.js";

document.addEventListener("DOMContentLoaded", function () {
  let newTeamModalContainer = document.createElement("div");
  newTeamModalContainer.id = "newTeamModalContainer";
  document.body.appendChild(newTeamModalContainer);

  const newTeamModalHTML = `
    <div id="newTeamModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewTeamModal"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Nieuwe team toevoegen</h2>
        <form id="newteamForm">

          <div>
            <label for="new_team_id">Team</label>
            <input type="text" id="new_team" name="team_id" required>
          </div>

          <button type="submit" class="btn btn--primary">Toevoegen</button>
        </form>
      </div>
    </div>
  `;

  newTeamModalContainer.innerHTML = newTeamModalHTML;

  const newTeamModal = document.getElementById("newTeamModal");
  const addNewTeamBtn = document.getElementById("addNewTeam");
  const closeNewModalBtn = document.getElementById("closeNewTeamModal");
  const newTeamForm = document.getElementById("newteamForm");

  const loadTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const teams = await response.json();
      const teamSelect = document.getElementById("new_team_id");

      while (teamSelect.options.length > 1) {
        teamSelect.remove(1);
      }

      teams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  loadTeams();

  if (addNewTeamBtn) {
    addNewTeamBtn.addEventListener("click", function () {
      newTeamModal.classList.remove("hidden");
    });
  }

  if (closeNewModalBtn) {
    closeNewModalBtn.addEventListener("click", function () {
      newTeamModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === newTeamModal) {
      newTeamModal.classList.add("hidden");
    }
  });

  if (newTeamForm) {
    newTeamForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const teamData = {
        name: document.getElementById("new_team").value,
      };

      try {
        const response = await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teamData),
        });

        if (response.ok) {
          newTeamModal.classList.add("hidden");
          getShowNotification()(
            "Team toegevoegd",
            "Dit Team is met success toegevoegd.",
            "success"
          );
          const teams = await getAllTeams();
          const $tableBody = document.querySelector("#teamsTableBody");
          $tableBody.innerHTML = "";
          teams.forEach((user) => {
            renderTeamRow(user, $tableBody);
          });
        } else {
          const errorData = await response.json();
          getShowNotification()(
            "Fout bij het toevoegen",
            errorData.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error adding match:", error);
        getShowNotification()(
          "Fout bij het toevoegen",
          "Er is een probleem opgetreden bij het toevoegen van de wedstrijd.",
          "error"
        );
      }
    });
  }
});
