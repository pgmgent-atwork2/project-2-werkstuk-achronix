import { deleteUser } from "./delete-user.js";
import { editUser } from "./edit-user.js";

if (document.getElementById("userTableBody")) {
  const $tableBody = document.getElementById("userTableBody");
  const $searchInput = document.getElementById("searchInput-user");

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/users/name/${searchTerm ? searchTerm : undefined}`
      );
      const users = await response.json();

      $tableBody.innerHTML = "";

      if (!users || users.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen gebruikers gevonden</td></tr>";
        return;
      }

      users.forEach((user) => {
        const $row = document.createElement("tr");
        $row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.firstname}</td>
          <td>${user.lastname}</td>
          <td>${user.email}</td>
          <td>${user.is_admin ? "Ja" : "Nee"}</td>
          <td>${user.receive_notifications ? "Ja" : "Nee"}</td>
          <td>
            <button class="btn btn--secondary edit-user" data-id="${user.id}">
              Bewerken
            </button>
            <button class="btn btn--danger delete-user" data-id="${user.id}">
              Verwijderen
            </button>
          </td>
        `;
        $tableBody.appendChild($row);
        deleteUser();
        editUser();
      });
    } catch (error) {
      console.error("Fout bij het ophalen van gebruikers:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van gebruikers</td></tr>";
    }
  });
}
