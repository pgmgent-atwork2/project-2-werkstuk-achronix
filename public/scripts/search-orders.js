if (document.getElementById("ordersTableBody")) {
  const $tableBody = document.getElementById("ordersTableBody");
  const $searchInput = document.getElementById("searchInput-orders");

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/orders/name/${searchTerm ? searchTerm : undefined}`
      );
      const orders = await response.json();

      $tableBody.innerHTML = "";

      if (!orders || orders.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen bestelling(en) gevonden</td></tr>";
        return;
      }

      orders.forEach((order) => {
        const date = new Date(order.order_on);
        const formattedDate = date.toLocaleString("nl-BE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        order.orderItems.forEach((item) => {
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
        });
      });
    } catch (error) {
      console.error("Fout bij het ophalen van bestelling(en):", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van bestelling(en)</td></tr>";
    }
  });
}
