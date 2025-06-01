if (document.getElementById("consumablesTableBody")) {
  const $tableBody = document.getElementById("consumablesTableBody");
  const $searchInput = document.getElementById("searchInput-consumables");

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
      );
      const consumables = await response.json();

      $tableBody.innerHTML = "";

      if (!consumables || consumables.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen producten gevonden</td></tr>";
        return;
      }

      consumables.forEach((consumable) => {
        const $row = document.createElement("tr");
        $row.innerHTML = `
          <td>${consumable.id}</td>
          <td>${consumable.name}</td>
          <td>${consumable.price}</td>
          <td> <img src=${consumable.image_url} alt="${consumable.name}"></td>
            <td>${consumable.category_id}</td>
          <td>
            <button class="btn btn--secondary edit-consumable" data-id="${consumable.id}">
              Bewerken
            </button>
            <button class="btn btn--danger delete-consumable" data-id="${consumable.id}">
              Verwijderen
            </button>
          </td>
        `;
        $tableBody.appendChild($row);
      });
    } catch (error) {
      console.error("Fout bij het ophalen van producten:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van producten</td></tr>";
    }
  });
}


