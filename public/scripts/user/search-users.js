import { deleteUser } from "./delete-user.js";
import { editUser } from "./edit-user.js";
import renderUserRow from "./user-table.js";

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
        renderUserRow(user, $tableBody);
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
