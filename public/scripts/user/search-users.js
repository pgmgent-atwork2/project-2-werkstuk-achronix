import { deleteUser } from "./delete-user.js";
import { editUser } from "./edit-user.js";
import renderUserRow from "./user-table.js";

if (document.getElementById("userTableBody")) {
  const $tableBody = document.getElementById("userTableBody");
  const $searchInput = document.getElementById("searchInput-user");

  let $filterSelect =
    document.getElementById("filterSelect") ||
    document.getElementById("filterSelect-user") ||
    document.querySelector(".filter-select");

  console.log("Filter select element:", $filterSelect);

  let currentRoleFilter = "";

  async function performUserSearch(searchTerm) {
    try {
      let users;

      if (currentRoleFilter && currentRoleFilter !== "") {
        const response = await fetch(`/api/users/role/${currentRoleFilter}`);
        const roleUsers = await response.json();

        if (searchTerm) {
          users = roleUsers.filter((user) =>
            `${user.firstname} ${user.lastname}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        } else {
          users = roleUsers;
        }
      } else {
        const response = await fetch(
          `/api/users/name/${searchTerm ? searchTerm : undefined}`
        );
        users = await response.json();
      }

      $tableBody.innerHTML = "";

      if (!users || users.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen gebruikers gevonden</td></tr>";
        return;
      }

      users.forEach((user) => {
        renderUserRow(user, $tableBody);
      });
      deleteUser();
      editUser();
    } catch (error) {
      console.error("Fout bij het ophalen van gebruikers:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van gebruikers</td></tr>";
    }
  }

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    await performUserSearch(searchTerm);
  });

  if ($filterSelect) {
    $filterSelect.addEventListener("change", async (event) => {

      let filterValue = event.target.value;
      if (filterValue === "admin") {
        filterValue = "admin";
      } else if (filterValue === "user") {
        filterValue = "user";
      }

      currentRoleFilter = filterValue;
      const searchTerm = $searchInput.value.toLowerCase();
      await performUserSearch(searchTerm);
    });
  } else {;
    setTimeout(() => {
      $filterSelect =
        document.getElementById("filterSelect") ||
        document.getElementById("filterSelect-user") ||
        document.querySelector(".filter-select");

      if ($filterSelect) {
        $filterSelect.addEventListener("change", async (event) => {
          let filterValue = event.target.value;
          if (filterValue === "admin") {
            filterValue = "admin";
          } else if (filterValue === "user") {
            filterValue = "user";
          }

          currentRoleFilter = filterValue;
          const searchTerm = $searchInput.value.toLowerCase();
          await performUserSearch(searchTerm);
        });
      }
    }, 1000);
  }
}
