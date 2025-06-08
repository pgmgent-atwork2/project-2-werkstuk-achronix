export default function renderConsumableCard(
  consumable,
  $consumablesContainer,
  userId
) {
  const $consumableCard = document.createElement("article");
  $consumableCard.classList.add("consumable");
  $consumableCard.innerHTML = `
          <img class="consumable__image" src="${consumable.image_url}" alt="${consumable.name}">
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
        <input class="user-id-order" type="hidden" name="user_id" value="${userId}" />
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
          max="${consumable.stock}"
          value="0"
        />
        <button name="increase" type="submit" class="increase-count">+</button>
      </form>
    </div>
        `;
  $consumablesContainer.appendChild($consumableCard);
}
