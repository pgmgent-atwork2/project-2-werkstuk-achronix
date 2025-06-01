import renderOrderRow from "./order-table.js";

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
          renderOrderRow(order,item, $tableBody, formattedDate);
        });

      });
    } catch (error) {
      console.error("Fout bij het ophalen van bestelling(en):", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van bestelling(en)</td></tr>";
    }
  });

  const $filterSelect = document.getElementById("filterSelect");

  $filterSelect.addEventListener("change", async (event) => {
    const status = event.target.value;

    try {
      const response = await fetch(`/api/orders/status/${status ? status : undefined}`);
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
          renderOrderRow(order,item, $tableBody, formattedDate);
        });
      });
    } catch (error) {
      console.error("Fout bij het ophalen van bestelling(en):", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van bestelling(en)</td></tr>";
    }
  });
}
