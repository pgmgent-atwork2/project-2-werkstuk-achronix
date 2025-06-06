export default function renderUserRow(user, $tableBody) {
  const $row = document.createElement("tr");
  $row.innerHTML = `
              <td>${user.id}</td>
              <td>${user.firstname}</td>
              <td>${user.lastname}</td>
              <td>${user.email}</td>
              <td>${user.is_admin}</td>
              <td>${user.receive_notifications ? "Ja" : "Nee"}</td>

            
                <button class="btn btn--secondary edit-user" data-id="${
                  user.id
                }">
                  Bewerken
                </button>
                <button class="btn btn--danger delete-user" data-id="${
                  user.id
                }">
                  Verwijderen
                </button>
              </td>
            `;
  $tableBody.appendChild($row);
}
