export function showConsumableQuantityChange() {
  const $consumables = document.querySelectorAll(".consumable");

  $consumables.forEach(($consumable) => {
    const $btn = $consumable.querySelector(".consumable__button");
    const $form = $consumable.querySelector(".consumable__form");

    const $quantityInput = $form.querySelector(".consumable__quantity");
    const $reduceBtn = $form.querySelector(".reduce-count");
    const $increaseBtn = $form.querySelector(".increase-count");

    $btn.addEventListener("click", (e) => {
      $form.classList.add("show");
      $quantityInput.value = 0;
    });

    $reduceBtn.addEventListener("click", (e) => {
      let currentValue = parseInt($quantityInput.value);
      if (currentValue > 0) {
        currentValue--;
        $quantityInput.value = currentValue;
      }

      if (currentValue === 0) {
        $form.classList.remove("show");
      }
    });

    $increaseBtn.addEventListener("click", (e) => {
      let currentValue = parseInt($quantityInput.value);
      currentValue++;
      $quantityInput.value = currentValue;
    });

    $form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData($form);
      const consumableId = formData.get("consumable_id");
      const userId = formData.get("user_id");
      const quantity = formData.get("quantity");
      const price = formData.get("consumable_price");
      const consumableName = formData.get("consumable_name");
      const consumableImage = formData.get("consumable_image");
      const newPrice = quantity * price;

      const data = {
        consumable_id: consumableId,
        user_id: userId,
        quantity,
        price: newPrice,
        consumableName,
        consumableImage,
      };

      storeOrder(data);
    });
  });
}

function storeOrder(data) {
  showCart(cart);
}

function showCart(items) {
  const $cart = document.querySelector(".cart");
  const $cartItems = $cart.querySelector(".cart__items");

  items.forEach((item, i) => {
    $cartItems.innerHTML += `
    <li class="cart__item">
      <img class="cart__item-image" src="${item.consumableImage}" alt="${item.consumableName}">
      <span class="cart__item-name">${item.consumableName}</span>
      <span class="cart__item-quantity">${item.quantity}</span>
      <span class="cart__item-price">${item.price}</span>
      <button class="cart__item-remove" data-index="${i}">Remove</button>
    </li>`;
  });
}
