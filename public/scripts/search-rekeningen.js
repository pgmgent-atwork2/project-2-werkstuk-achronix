if (
  document.querySelector("tbody") &&
  window.location.pathname.includes("/rekeningen")
) {
  const $tableBody = document.querySelector("tbody");
  const $searchInput = document.getElementById("searchInput-user");

  const isRekeningenPage = window.location.pathname.includes("/rekeningen");

  async function performRekeningenSearch(searchTerm) {
    try {
      console.log("Performing rekeningen search with term:", searchTerm);

      const response = await fetch(
        `/api/users/rekeningen/search/${searchTerm || "all"}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const users = await response.json();

      $tableBody.innerHTML = "";

      if (!users || users.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='2'>Geen gebruikers gevonden</td></tr>";
        return;
      }

      users.forEach((user) => {
        renderRekeningRow(user, $tableBody);
      });

      console.log(`Rendered ${users.length} users`);
    } catch (error) {
      console.error("Fout bij het ophalen van gebruikers:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='2'>Fout bij het ophalen van gebruikers</td></tr>";
    }
  }

  function renderRekeningRow(user, tableBody) {
    const totalAmount = user.totalAmount || 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <a href="/beheerderspaneel/rekeningen/${user.id}">
          ${user.firstname} ${user.lastname}
        </a>
      </td>
      <td>€${totalAmount.toFixed(2)}</td>
    `;

    tableBody.appendChild(row);
  }

  if ($searchInput && isRekeningenPage) {
    $searchInput.addEventListener("input", async (event) => {
      const searchTerm = event.target.value.toLowerCase().trim();
      await performRekeningenSearch(searchTerm);
    });

    console.log("Rekeningen search functionality initialized");
  }
}
