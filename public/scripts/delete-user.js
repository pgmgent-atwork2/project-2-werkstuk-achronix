const deleteButtons = document.querySelectorAll(".delete-user");

deleteButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    const userId = this.getAttribute("data-id");

    if (confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Gebruiker succesvol verwijderd!");
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Fout: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(
          "Er is een probleem opgetreden bij het verwijderen van de gebruiker."
        );
      }
    }
  });
});
