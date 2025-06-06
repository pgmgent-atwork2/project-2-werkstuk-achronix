import { getShowNotification } from "./utils/notifications.js";

document.addEventListener("DOMContentLoaded", function () {
  let editMatchModalContainer = document.createElement("div");
  editMatchModalContainer.id = "edit-match-modal-container";
  document.body.appendChild(editMatchModalContainer);

  const editMatchModalHTML = `
    <div id="editMatchModal" class="modal hidden">
      <div class="modal-content">
        <span class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Wedstrijd bewerken</h2>
        <form id="editMatchForm">
          <input type="hidden" id="matchId" name="matchId">

          <div>
            <label for="date">Datum</label>
            <input type="date" id="date" name="date" required>
          </div>
          
          <div>
            <label for="start_time">Starttijd</label>
            <input type="time" id="start_time" name="start_time">
          </div>
          
          <div>
            <label for="end_time">Eindtijd</label>
            <input type="time" id="end_time" name="end_time">
          </div>

          <div>
            <label for="location">Locatie</label>
            <input type="text" id="location" name="location" required>
          </div>

          <div>
            <label for="home_away">Thuis/Uit</label>
            <select id="home_away" name="home_away" required>
              <option value="THUIS">Thuis</option>
              <option value="UIT">Uit</option>
            </select>
          </div>

          <div>
            <label for="team_id">Team</label>
            <select id="team_id" name="team_id">
              <option value="">-- Selecteer team --</option>
            </select>
          </div>

          <button type="submit" class="btn btn--primary">Opslaan</button>
        </form>
      </div>
    </div>
  `;

  editMatchModalContainer.innerHTML = editMatchModalHTML;

  const modal = document.getElementById("editMatchModal");
  const editButtons = document.querySelectorAll(".edit-match");
  const closeBtn = document.querySelector("#editMatchModal .close");
  const matchIdInput = document.getElementById("matchId");
  const dateInput = document.getElementById("date");
  const startTimeInput = document.getElementById("start_time");
  const endTimeInput = document.getElementById("end_time");
  const locationInput = document.getElementById("location");
  const homeAwayInput = document.getElementById("home_away");
  const teamIdInput = document.getElementById("team_id");
  const editMatchForm = document.getElementById("editMatchForm");

  const loadTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const teams = await response.json();
      const teamSelect = document.getElementById("team_id");

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

  if (editButtons) {
    editButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const matchId = this.getAttribute("data-id");

        try {
          const response = await fetch(`/api/matches/${matchId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch match data");
          }

          const matchData = await response.json();

          const date = new Date(matchData.date);
          const formattedDate = date.toISOString().split("T")[0];

          matchIdInput.value = matchData.id;
          dateInput.value = formattedDate;
          startTimeInput.value = matchData.start_time || "";
          endTimeInput.value = matchData.end_time || "";
          locationInput.value = matchData.location;
          homeAwayInput.value = matchData.home_away;
          teamIdInput.value = matchData.team_id || "";

          modal.classList.remove("hidden");
        } catch (error) {
          console.error("Error fetching match data:", error);
          alert(
            "Er is een probleem opgetreden bij het ophalen van de wedstrijdgegevens."
          );
        }
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  if (editMatchForm) {
    editMatchForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!dateInput.value) {
        alert("Vul een geldige datum in.");
        return;
      }

      if (!locationInput.value) {
        alert("Vul een locatie in.");
        return;
      }

      if (!homeAwayInput.value) {
        alert("Selecteer Thuis of Uit.");
        return;
      }

      const matchId = matchIdInput.value;
      const matchData = {
        date: dateInput.value,
        start_time: startTimeInput.value || null,
        end_time: endTimeInput.value || null,
        location: locationInput.value,
        home_away: homeAwayInput.value,
        team_id: teamIdInput.value ? parseInt(teamIdInput.value, 10) : null,
      };

      try {
        const response = await fetch(`/api/matches/${matchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData),
        });

       if (response.ok) {
        modal.classList.add("hidden");
        getShowNotification(
          "Wedstrijd bijgewerkt",
          "wedstrijd is succesvol bijgewerkt.",
          "success"
        );
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await response.json();
        getShowNotification("Fout bij het bijwerken", errorData.message, "error");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      getShowNotification(
        "Fout bij het bijwerken",
        "Er is een probleem opgetreden bij het bijwerken van de wedstrijd.",
        "error"
      );
      }
    });
  }
});
