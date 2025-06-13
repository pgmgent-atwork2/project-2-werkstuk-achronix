import { getShowNotification } from "../utils/notifications.js";

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Spending limit management loaded");
  await loadCurrentLimit();
  setupSpendingLimitForm();
});

async function loadCurrentLimit() {
  try {
    const response = await fetch("/api/settings/spending-limit");
    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();

      const currentLimitDisplay = document.getElementById(
        "currentLimitDisplay"
      );
      const spendingLimitInput = document.getElementById("spending_limit");

      if (currentLimitDisplay && spendingLimitInput) {
        currentLimitDisplay.textContent = `€${data.data.limit.toFixed(2)}`;
        spendingLimitInput.value = data.data.limit.toFixed(2);

        const limitContainer = currentLimitDisplay.closest(
          ".current-limit-display"
        );
        limitContainer.classList.add("updated");
        setTimeout(() => limitContainer.classList.remove("updated"), 2000);
      }
    } else {
      const errorText = await response.text();
      console.error("Error response:", errorText);
    }
  } catch (error) {
    console.error("Error loading current limit:", error);
  }
}

function setupSpendingLimitForm() {
  const form = document.getElementById("updateSpendingLimitForm");
  const limitInput = document.getElementById("spending_limit");

  if (form && limitInput) {
    limitInput.addEventListener("input", function () {
      const value = parseFloat(this.value);
      if (isNaN(value) || value < 0) {
        this.classList.add("error");
        this.classList.remove("valid");
      } else {
        this.classList.add("valid");
        this.classList.remove("error");
      }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitButton = form.querySelector(".spending-limit-form__button");
      const originalText = submitButton.textContent;

      const limit = parseFloat(limitInput.value);

      if (isNaN(limit) || limit < 0) {
        getShowNotification()(
          "Ongeldige invoer",
          "Voer een geldig bedrag in.",
          "error"
        );
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Bezig met bijwerken...";

      try {
        const response = await fetch("/api/settings/spending-limit", {
          method: "PUT",
          headers: {
        "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Update successful:", result);
          await loadCurrentLimit();
          getShowNotification()(
        "Limiet bijgewerkt",
        "De uitgavelimiet per bestelling is succesvol bijgewerkt.",
        "success"
          );
        } else {
          const errorData = await response.json();
          getShowNotification()(
        "Fout bij bijwerken",
        errorData.message || "Er is een fout opgetreden.",
        "error"
          );
        }
      } catch (error) {
        console.error("Error updating spending limit:", error);
        getShowNotification()(
          "Fout bij bijwerken",
          "Er is een probleem opgetreden bij het bijwerken van de limiet.",
          "error"
        );
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  } else {
    console.error("Form not found!");
  }
}
