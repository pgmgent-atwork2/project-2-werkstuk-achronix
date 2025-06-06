export default function renderConsumableRow(consumable, $tableBody) {
  const $row = document.createElement("tr");
  $row.innerHTML = `
              <td>${consumable.id}</td>
              <td>${consumable.name}</td>
              <td>${consumable.price}</td>
              <td>${consumable.stock}</td>
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
}
