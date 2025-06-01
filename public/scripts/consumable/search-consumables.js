import { InitShoppingCart } from "../shoppingCart.js";

if (document.getElementById("consumablesTableBody")) {
  const $tableBody = document.getElementById("consumablesTableBody");

  const $searchInput = document.getElementById("searchInput-consumables");

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
      );
      const consumables = await response.json();

      $tableBody.innerHTML = "";

      if (!consumables || consumables.length === 0) {
        $tableBody.innerHTML =
          "<tr><td colspan='7'>Geen producten gevonden</td></tr>";
        return;
      }

      consumables.forEach((consumable) => {
        const $row = document.createElement("tr");
        $row.innerHTML = `
          <td>${consumable.id}</td>
          <td>${consumable.name}</td>
          <td>${consumable.price}</td>
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
      });
    } catch (error) {
      console.error("Fout bij het ophalen van producten:", error);
      $tableBody.innerHTML =
        "<tr><td colspan='7'>Fout bij het ophalen van producten</td></tr>";
    }
  });
}

if (document.querySelector(".consumables")) {
  const $consumablesContainer = document.querySelector(".consumables");
  const $searchInput = document.getElementById("searchInput-consumables");
  const userId = document.getElementById("logged-in-user").value;

  $searchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.toLowerCase();

    try {
      const response = await fetch(
        `/api/consumables/name/${searchTerm ? searchTerm : undefined}`
      );
      const consumables = await response.json();

      $consumablesContainer.innerHTML = "";
      if (!consumables || consumables.length === 0) {
        $consumablesContainer.innerHTML = "<p>Geen producten gevonden</p>";
        return;
      }

      consumables.forEach((consumable) => {
        const $consumableCard = document.createElement("article");
        $consumableCard.classList.add("consumable");
        $consumableCard.innerHTML = `
          <img class="consumable__image" src="${consumable.image_url}" alt="${consumable.name}">
          <h3>${consumable.name}</h3>
         <div class="consumable__details">
      <div class="consumable__info">
        <h2 class="consumable__name"> ${consumable.name}</h2>
        <p class="consumable__price">€ ${consumable.price}</p>
      </div>

      <button
        class="consumable__button btn btn--primary"
        data-id=" ${consumable.id}"
      >
        Toevoegen
      </button>
      <form action="#" method="post" class="consumable__form">
        <input
          type="hidden"
          name="consumable_id"
          value=" ${consumable.id} "
        />
        <input
          type="hidden"
          name="consumable_name"
          value=" ${consumable.name}"
        />
        <input
          type="hidden"
          name="consumable_image"
          value="${consumable.image_url}"
        />
        <input type="hidden" name="user_id" value="${userId}" />
        <input
          type="hidden"
          name="consumable_price"
          value="${consumable.price}"
        />
        <button name="reduce" type="submit" class="reduce-count">-</button>
        <input
          data-consumable-id="${consumable.id}"
          class="consumable__quantity"
          type="number"
          name="quantity"
          min="0"
          max="10"
          value="0"
        />
        <button name="increase" type="submit" class="increase-count">+</button>
      </form>
    </div>
        `;
        $consumablesContainer.appendChild($consumableCard);
      });
      InitShoppingCart();
    } catch (error) {
      $consumablesContainer.innerHTML =
        "<p>Fout bij het ophalen van producten</p>";
    }
  });
}
