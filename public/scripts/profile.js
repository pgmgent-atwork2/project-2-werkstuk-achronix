const profileForm = document.getElementById("profile-form");
const passwordError = document.getElementById("password-error");
const profileSuccess = document.getElementById("profile-success");

let showNotification =
  window.showNotification ||
  function (title, message, type) {
    alert(`${type.toUpperCase()}: ${title} - ${message}`);
  };

if (profileForm) {
  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    passwordError.classList.add("hidden");
    profileSuccess.classList.add("hidden");

    const email = document.getElementById("email").value;
    const receiveNotifications = document.getElementById(
      "receive_notifications"
    ).checked;
    const currentPassword = document.getElementById("current_password").value;
    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        passwordError.textContent = "Voer je huidige wachtwoord in";
        passwordError.classList.remove("hidden");
        return;
      }

      if (!newPassword) {
        passwordError.textContent = "Voer een nieuw wachtwoord in";
        passwordError.classList.remove("hidden");
        return;
      }

      if (newPassword.length < 8) {
        passwordError.textContent =
          "Wachtwoord moet minimaal 8 karakters lang zijn";
        passwordError.classList.remove("hidden");
        return;
      }

      if (newPassword !== confirmPassword) {
        passwordError.textContent = "Nieuwe wachtwoorden komen niet overeen";
        passwordError.classList.remove("hidden");
        return;
      }
    }

    const userData = {
      email: email,
      receive_notifications: receiveNotifications,
    };

    if (currentPassword && newPassword && confirmPassword) {
      userData.current_password = currentPassword;
      userData.password = newPassword;
    }

    try {
      const response = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showNotification(
          "Profiel bijgewerkt",
          "Je profiel is succesvol bijgewerkt",
          "success"
        );

        document.getElementById("current_password").value = "";
        document.getElementById("new_password").value = "";
        document.getElementById("confirm_password").value = "";
      } else {
        const errorData = await response.json();
        showNotification("Fout bij bijwerken", errorData.message, "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        "Fout bij bijwerken",
        "Er is een probleem opgetreden bij het bijwerken van je profiel",
        "error"
      );
    }
  });
}
