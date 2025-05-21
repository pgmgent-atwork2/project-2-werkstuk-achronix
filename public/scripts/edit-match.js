document.addEventListener("DOMContentLoaded", function () {
  let editMatchModalContainer = document.createElement("div");
  editMatchModalContainer.id = "edit-match-modal-container";
  document.body.appendChild(editMatchModalContainer);

  const editMatchModalHTML = `
    <div id="editMatchModal" class="modal hidden">
      <div class="modal-content">
        <span class="close">&times;</span>
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

          <button type="submit" class="btn">Opslaan</button>
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

  // Load teams for dropdown
  const loadTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const teams = await response.json();
      const teamSelect = document.getElementById("team_id");

      // Clear existing options except the first one
      while (teamSelect.options.length > 1) {
        teamSelect.remove(1);
      }

      // Add team options
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

  // Load teams when the page loads
  loadTeams();

  // Add event listeners to edit buttons
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

          // Format date to YYYY-MM-DD for input field
          const date = new Date(matchData.date);
          const formattedDate = date.toISOString().split("T")[0];

          matchIdInput.value = matchData.id;
          dateInput.value = formattedDate;
          startTimeInput.value = matchData.start_time || '';
          endTimeInput.value = matchData.end_time || '';
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

  // Close modal when clicking close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Handle form submission
  if (editMatchForm) {
    editMatchForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate form fields
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

        const responseData = await response.json();

        if (response.ok) {
          modal.classList.add("hidden");
          window.location.reload();
        } else {
          alert(`Fout: ${responseData.message}`);
        }
      } catch (error) {
        console.error("Error updating match:", error);
        alert(
          "Er is een probleem opgetreden bij het bijwerken van de wedstrijd."
        );
      }
    });
  }
});
