export default function renderOrderRow(order,item, $tableBody, formattedDate) {
  const $row = document.createElement("tr");
  $row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.user.firstname}</td>
          <td>${order.user.lastname}</td>
          <td>${item.consumable.id}</td>
            <td>${item.consumable.name}</td>
            <td>${item.quantity}</td>
              <td>€ ${item.price.toFixed(2)} </td>
            <td class="${order.status === "PAID" ? "success" : "error"}">${
    order.status
  }</td>
            <td>${formattedDate}</td>
          <td>
            <button class="btn btn--secondary edit-order" data-id="${order.id}">
              Bewerken
            </button>
          </td>
        `;
  $tableBody.appendChild($row);
}
