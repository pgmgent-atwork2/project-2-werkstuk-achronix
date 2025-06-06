document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById("filterSelect-matches");

  // Function to filter matches based on selected option
  const filterMatches = function () {
    const filterValue = filterSelect.value;
    const matchBlocks = document.querySelectorAll(".wedstrijd-blok");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to start of day for accurate comparison

    matchBlocks.forEach((block) => {
      const dateStr = block.getAttribute("data-date");
      const matchDate = new Date(dateStr);
      matchDate.setHours(0, 0, 0, 0); // Reset hours to start of day

      switch (filterValue) {
        case "upcoming":
          // Show only matches with dates in the future (including today)
          if (matchDate >= today) {
            block.style.display = "";
          } else {
            block.style.display = "none";
          }
          break;

        case "past":
          // Show only matches with dates in the past
          if (matchDate < today) {
            block.style.display = "";
          } else {
            block.style.display = "none";
          }
          break;

        case "all":
          // Show all matches
          block.style.display = "";
          break;
      }
    });

    // Check if any matches are visible after filtering
    const visibleMatches = [...matchBlocks].filter(
      (block) => block.style.display !== "none"
    );
    const noMatchesMessage = document.querySelector(".no-matches-message");
    const wedstrijdenGrid = document.querySelector(".wedstrijden-grid");

    if (visibleMatches.length === 0 && wedstrijdenGrid) {
      // No matches visible after filtering
      if (!noMatchesMessage) {
        const newMessage = document.createElement("p");
        newMessage.classList.add("no-matches-message");

        if (filterValue === "upcoming") {
          newMessage.textContent =
            "Er zijn geen aankomende wedstrijden gevonden.";
        } else if (filterValue === "past") {
          newMessage.textContent =
            "Er zijn geen afgelopen wedstrijden gevonden.";
        } else {
          newMessage.textContent = "Er zijn geen wedstrijden gevonden.";
        }

        wedstrijdenGrid.after(newMessage);
      }
      wedstrijdenGrid.style.display = "none";
    } else {
      // Some matches are visible
      if (
        noMatchesMessage &&
        noMatchesMessage.classList.contains("no-matches-message")
      ) {
        noMatchesMessage.remove();
      }
      if (wedstrijdenGrid) {
        wedstrijdenGrid.style.display = "";
      }
    }
  };

  // Initial filtering when page loads (default to upcoming)
  if (filterSelect) {
    filterSelect.value = "upcoming"; // Set default filter to upcoming
    filterMatches(); // Apply the filter

    // Add event listener for filter changes
    filterSelect.addEventListener("change", filterMatches);
  }
});
