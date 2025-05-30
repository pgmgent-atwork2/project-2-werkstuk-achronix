document.addEventListener("DOMContentLoaded", function () {
  let newMatchModalContainer = document.createElement("div");
  newMatchModalContainer.id = "new-match-modal-container";
  document.body.appendChild(newMatchModalContainer);

  const newMatchModalHTML = `
    <div id="newMatchModal" class="modal hidden">
      <div class="modal-content">
        <span class="close" id="closeNewMatchModal"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</span>
        <h2>Nieuwe wedstrijd toevoegen</h2>
        <form id="newMatchForm">
          <div>
            <label for="new_date">Datum</label>
            <input type="date" id="new_date" name="date" required>
          </div>
          
          <div>
            <label for="new_start_time">Starttijd</label>
            <input type="time" id="new_start_time" name="start_time">
          </div>
          
          <div>
            <label for="new_end_time">Eindtijd</label>
            <input type="time" id="new_end_time" name="end_time">
          </div>

          <div>
            <label for="new_location">Locatie</label>
            <input type="text" id="new_location" name="location" required>
          </div>

          <div>
            <label for="new_home_away">Thuis/Uit</label>
            <select id="new_home_away" name="home_away" required>
              <option value="THUIS">Thuis</option>
              <option value="UIT">Uit</option>
            </select>
          </div>

          <div>
            <label for="new_team_id">Team</label>
            <select id="new_team_id" name="team_id">
              <option value="">-- Selecteer team --</option>
            </select>
          </div>

          <button type="submit" class="btn btn--primary">Toevoegen</button>
        </form>
      </div>
    </div>
  `;

  newMatchModalContainer.innerHTML = newMatchModalHTML;

  const newMatchModal = document.getElementById("newMatchModal");
  const addNewMatchBtn = document.getElementById("addNewMatch");
  const closeNewModalBtn = document.getElementById("closeNewMatchModal");
  const newMatchForm = document.getElementById("newMatchForm");

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

  if (addNewMatchBtn) {
    addNewMatchBtn.addEventListener("click", function () {
      newMatchModal.classList.remove("hidden");
    });
  }

  if (closeNewModalBtn) {
    closeNewModalBtn.addEventListener("click", function () {
      newMatchModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === newMatchModal) {
      newMatchModal.classList.add("hidden");
    }
  });

  if (newMatchForm) {
    newMatchForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!document.getElementById("new_date").value) {
        alert("Vul een geldige datum in.");
        return;
      }

      if (!document.getElementById("new_location").value) {
        alert("Vul een locatie in.");
        return;
      }

      if (!document.getElementById("new_home_away").value) {
        alert("Selecteer Thuis of Uit.");
        return;
      }

      const matchData = {
        date: document.getElementById("new_date").value,
        start_time: document.getElementById("new_start_time").value || null,
        end_time: document.getElementById("new_end_time").value || null,
        location: document.getElementById("new_location").value,
        home_away: document.getElementById("new_home_away").value,
        team_id: document.getElementById("new_team_id").value
          ? parseInt(document.getElementById("new_team_id").value, 10)
          : null,
      };

      try {
        const response = await fetch("/api/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData),
        });

        if (response.ok) {
          newMatchModal.classList.add("hidden");
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Fout: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error creating match:", error);
        alert(
          "Er is een probleem opgetreden bij het aanmaken van de wedstrijd."
        );
      }
    });
  }
});
