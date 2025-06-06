const filterSelect = document.getElementById("filterSelect-matches");

const filterMatches = function () {
  const filterValue = filterSelect.value;
  const matchBlocks = document.querySelectorAll(".wedstrijd-blok");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  matchBlocks.forEach((block) => {
    const dateStr = block.getAttribute("data-date");
    const matchDate = new Date(dateStr);
    matchDate.setHours(0, 0, 0, 0);

    switch (filterValue) {
      case "upcoming":
        if (matchDate >= today) {
          block.style.display = "";
        } else {
          block.style.display = "none";
        }
        break;

      case "past":
        if (matchDate < today) {
          block.style.display = "";
        } else {
          block.style.display = "none";
        }
        break;

      case "all":
        block.style.display = "";
        break;
    }
  });

  const visibleMatches = [...matchBlocks].filter(
    (block) => block.style.display !== "none"
  );
  const noMatchesMessage = document.querySelector(".no-matches-message");
  const wedstrijdenGrid = document.querySelector(".wedstrijden-grid");

  if (visibleMatches.length === 0 && wedstrijdenGrid) {
    if (!noMatchesMessage) {
      const newMessage = document.createElement("p");
      newMessage.classList.add("no-matches-message");

      if (filterValue === "upcoming") {
        newMessage.textContent =
          "Er zijn geen aankomende wedstrijden gevonden.";
      } else if (filterValue === "past") {
        newMessage.textContent = "Er zijn geen afgelopen wedstrijden gevonden.";
      } else {
        newMessage.textContent = "Er zijn geen wedstrijden gevonden.";
      }

      wedstrijdenGrid.after(newMessage);
    }
    wedstrijdenGrid.style.display = "none";
  } else {
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

if (filterSelect) {
  filterSelect.value = "upcoming";
  filterMatches();

  filterSelect.addEventListener("change", filterMatches);
}
