import renderOrderRow from "./order-table.js";

if (document.getElementById("ordersTableBody")) {
  const $tableBody = document.getElementById("ordersTableBody");
  const $searchInput = document.getElementById("searchInput-orders");
  const $filterSelect = document.getElementById("filterSelect");

  let currentStatusFilter = "";

  async function performOrderSearch(searchTerm) {
    try {
      let orders;

      if (currentStatusFilter) {
        const response = await fetch(
          `/api/orders/status/${currentStatusFilter}`
        );
        const statusOrders = await response.json();

        if (searchTerm) {
          orders = statusOrders.filter((order) =>
            `${order.user.firstname} ${order.user.lastname}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        } else {
          orders = statusOrders;
        }
      } else {
        const response = await fetch(
          `/api/orders/name/${searchTerm ? searchTerm : undefined}`
        );
        orders = await response.json();
      }

      $tableBody.innerHTML = "";

      if (!orders || orders.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='11'>Geen bestelling(en) gevonden</td></tr>";
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
          renderOrderRow(order, item, $tableBody, formattedDate);
        });
      });
    } catch (error) {
      console.error("Fout bij het ophalen van bestelling(en):", error);
      $tableBody.innerHTML =
        "<tr><td colspan='11'>Fout bij het ophalen van bestelling(en)</td></tr>";
    }
  }

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    await performOrderSearch(searchTerm);
  });

  $filterSelect.addEventListener("change", async (event) => {
    currentStatusFilter = event.target.value;
    const searchTerm = $searchInput.value.toLowerCase();
    await performOrderSearch(searchTerm);
  });
}
