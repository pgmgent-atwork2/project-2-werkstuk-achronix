console.log("Cash payment calculator script loading...");

let showNotification = (title, message, type) => {
  console.log(`${type.toUpperCase()}: ${title} - ${message}`);
  alert(`${title}: ${message}`);
};

import("./utils/notifications.js")
    .then((module) => {
        if (module.getShowNotification) {
            showNotification = module.getShowNotification();
        }
    })
    .catch(() => {
    });

export function initializeCashPaymentCalculator() {

    let modalContainer = document.getElementById("cash-payment-modal-container");
  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.id = "cash-payment-modal-container";
    document.body.appendChild(modalContainer);
  }

  const modalHTML = `
    <div id="cashPaymentModal" class="modal hidden">
      <div class="modal-content cash-payment-modal">
        <span class="close" id="closeCashModal">×</span>
        <h2>Cash Betaling Verificatie</h2>
        
        <div class="order-summary">
          <div class="order-amount">
            <span class="label">Bestelbedrag:</span>
            <span class="amount" id="orderAmount">€0.00</span>
          </div>
        </div>

        <div class="cash-input-section">
          <h3>Voer Cash Denominaties In</h3>
          <div class="denominations-grid">
            <div class="denomination-item">
              <label>€10 Biljetten</label>
              <input type="number" min="0" value="0" data-value="10" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€5 Biljetten</label>
              <input type="number" min="0" value="0" data-value="5" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€2 Munten</label>
              <input type="number" min="0" value="0" data-value="2" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€1 Munten</label>
              <input type="number" min="0" value="0" data-value="1" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€0.50 Munten</label>
              <input type="number" min="0" value="0" data-value="0.5" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€0.20 Munten</label>
              <input type="number" min="0" value="0" data-value="0.2" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€0.10 Munten</label>
              <input type="number" min="0" value="0" data-value="0.1" class="denomination-input">
            </div>
            <div class="denomination-item">
              <label>€0.05 Munten</label>
              <input type="number" min="0" value="0" data-value="0.05" class="denomination-input">
            </div>
          </div>
        </div>

        <div class="calculation-section">
          <div class="cash-total">
            <span class="label">Totaal Cash Ontvangen:</span>
            <span class="total" id="cashTotal">€0.00</span>
          </div>
          
          <div class="payment-status" id="paymentStatus">
            <div class="status-message" id="statusMessage">Voer bovenstaande cash denominaties in</div>
          </div>
        </div>

        <div class="action-buttons">
          <button id="clearCash" class="btn btn--secondary">Alles Wissen</button>
          <button id="confirmPayment" class="btn btn--success" disabled>Betaling Bevestigen</button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  const modal = document.getElementById("cashPaymentModal");
  const closeBtn = document.getElementById("closeCashModal");
  const denominationInputs = document.querySelectorAll(".denomination-input");
  const cashTotalElement = document.getElementById("cashTotal");
  const statusMessage = document.getElementById("statusMessage");
  const paymentStatus = document.getElementById("paymentStatus");
  const confirmButton = document.getElementById("confirmPayment");
  const clearButton = document.getElementById("clearCash");
  const orderAmountElement = document.getElementById("orderAmount");

  console.log("Modal elements found:", {
    modal: !!modal,
    closeBtn: !!closeBtn,
    denominationInputs: denominationInputs.length,
    confirmButton: !!confirmButton,
  });

  let orderAmount = 0;
  let currentUserId = null;
  let currentOrderId = null;

  // Calculate total cash and update status
  function calculateTotal() {
    let totalCash = 0;
    const cashBreakdown = [];

    denominationInputs.forEach((input) => {
      const count = parseInt(input.value) || 0;
      const value = parseFloat(input.dataset.value);

      if (count > 0) {
        totalCash += count * value;
        cashBreakdown.push({
          denomination: `€${value}`,
          count: count,
          total: count * value,
        });
      }
    });

    cashTotalElement.textContent = `€${totalCash.toFixed(2)}`;
    updatePaymentStatus(totalCash);
    return { totalCash, cashBreakdown };
  }

  function updatePaymentStatus(cashTotal) {
    const difference = cashTotal - orderAmount;

    // Reset classes
    paymentStatus.className = "payment-status";

    if (cashTotal === 0) {
      statusMessage.innerHTML = "Voer bovenstaande cash denominaties in";
      confirmButton.disabled = true;
    } else if (Math.abs(difference) < 0.01) {
      // Account for floating point precision
      statusMessage.innerHTML = "<strong>Correct Bedrag</strong>";
      paymentStatus.classList.add("status-correct");
      confirmButton.disabled = false;
    } else if (difference > 0) {
      statusMessage.innerHTML = `<strong>Wisselgeld: €${difference.toFixed(
        2
      )}</strong>`;
      paymentStatus.classList.add("status-overpaid");
      confirmButton.disabled = false;
    } else {
      statusMessage.innerHTML = `<strong>Tekort: €${Math.abs(
        difference
      ).toFixed(2)}</strong>`;
      paymentStatus.classList.add("status-underpaid");
      confirmButton.disabled = true;
    }
  }

  // Event listeners
  denominationInputs.forEach((input) => {
    input.addEventListener("input", calculateTotal);
  });

  clearButton.addEventListener("click", () => {
    denominationInputs.forEach((input) => {
      input.value = 0;
    });
    calculateTotal();
  });

  closeBtn.addEventListener("click", () => {
    console.log("Closing modal");
    modal.classList.add("hidden");
  });

  confirmButton.addEventListener("click", async () => {
    const { totalCash, cashBreakdown } = calculateTotal();

    console.log("=== PAYMENT CONFIRMATION ===");
    console.log("Order amount:", orderAmount);
    console.log("Total cash:", totalCash);
    console.log("Cash breakdown:", cashBreakdown);

    if (totalCash >= orderAmount) {
      // Disable button to prevent double clicks
      confirmButton.disabled = true;
      confirmButton.innerHTML = "⏳ Bezig met verwerken...";

      try {
        const cashDetails = {
          orderAmount: orderAmount,
          cashGiven: totalCash,
          change: totalCash - orderAmount,
          breakdown: cashBreakdown,
          processedAt: new Date().toISOString(),
        };

        console.log("Sending payment request with details:", cashDetails);

        const response = await fetch("/process-cash-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            orderId: currentOrderId,
            cashDetails: cashDetails,
          }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("Payment successful:", result);

          // Show success notification
          showNotification(
            "💰 Betaling Geslaagd",
            `Cash betaling van €${totalCash.toFixed(
              2
            )} is succesvol verwerkt. ${
              totalCash > orderAmount
                ? `Wisselgeld: €${(totalCash - orderAmount).toFixed(2)}`
                : ""
            }`,
            "success"
          );

          // Close modal
          modal.classList.add("hidden");

          // Reload the current page to show updated payment status
          setTimeout(() => {
            console.log("Reloading page to show updated payment status...");
            window.location.reload();
          }, 1500);
        } else {
          const errorData = await response.text();
          console.error("Payment failed:", errorData);

          showNotification(
            "❌ Betaling Mislukt",
            "Er is een fout opgetreden bij het verwerken van de cash betaling.",
            "error"
          );

          // Re-enable button
          confirmButton.disabled = false;
          confirmButton.innerHTML = "✅ Betaling Bevestigen";
        }
      } catch (error) {
        console.error("Error processing payment:", error);

        showNotification(
          "🚫 Netwerkfout",
          "Er is een netwerkfout opgetreden bij het verwerken van de betaling.",
          "error"
        );

        confirmButton.disabled = false;
        confirmButton.innerHTML = "✅ Betaling Bevestigen";
      }
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  window.openCashPaymentModal = function (amount, userId, orderId) {
    console.log("Opening cash payment modal:", { amount, userId, orderId });

    orderAmount = parseFloat(amount);
    currentUserId = userId;
    currentOrderId = orderId;

    orderAmountElement.textContent = `€${orderAmount.toFixed(2)}`;

    denominationInputs.forEach((input) => {
      input.value = 0;
    });
    calculateTotal();

    modal.classList.remove("hidden");
    console.log("Modal should now be visible");
  };

  console.log("Cash payment calculator initialized successfully");
  console.log(
    "openCashPaymentModal function available:",
    typeof window.openCashPaymentModal
  );
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing cash payment calculator...");
  initializeCashPaymentCalculator();
});

console.log("Cash payment calculator script loaded");
