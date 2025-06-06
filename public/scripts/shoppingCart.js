import { addOrderToDb } from "./order.js";
let orderIntialized = false;

export function InitShoppingCart() {
  const $consumables = document.querySelectorAll(".consumable");
  const $cart = document.querySelector(".cart");
  const $showCart = document.getElementById("show-cart");
  const $closeCart = document.getElementById("close-cart");

  const key = "cart";
  const cart = JSON.parse(localStorage.getItem(key)) || [];

  handleAboveStockAmount();

  if (!orderIntialized) {
    orderIntialized = true;
    handleOrder(key);
    handleInstantOrder(key);
  }

  if (cart.length > 0) {
    $showCart.parentElement.classList.remove("hidden");
    showCountOnInput(cart);
    handleShoppingCart(cart);

    removeItemFromCart();
  } else {
    $cart.classList.remove("show");
    $showCart.parentElement.classList.add("hidden");
  }

  $showCart.addEventListener("click", () => {
    $cart.classList.add("show");
  });

  $closeCart.addEventListener("click", () => {
    $cart.classList.remove("show");
  });

  $consumables.forEach(($consumable) => {
    const $btn = $consumable.querySelector(".consumable__button");
    const $form = $consumable.querySelector(".consumable__form");

    const $quantityInput = $form.querySelector(".consumable__quantity");
    const $reduceBtn = $form.querySelector(".reduce-count");
    const $increaseBtn = $form.querySelector(".increase-count");

    $btn.addEventListener("click", () => {
      $form.classList.add("show");
    });

    $reduceBtn.addEventListener("click", () => {
      let currentValue = parseInt($quantityInput.value);
      if (currentValue > 0) {
        currentValue--;
        $quantityInput.value = currentValue;
      }

      if (currentValue === 0) {
        $form.classList.remove("show");
      }
    });

    $increaseBtn.addEventListener("click", () => {
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
        consumable_id: parseInt(consumableId),
        user_id: parseInt(userId),
        quantity: parseInt(quantity),
        price: newPrice,
        consumableName,
        consumableImage,
      };

      handleShoppingCart(data);
    });
  });
}

function handleShoppingCart(data) {
  const $showCart = document.getElementById("show-cart");
  const $cartItemCount = document.getElementById("item__count");

  const key = "cart";
  let cart = JSON.parse(localStorage.getItem(key)) || [];

  if (parseInt(data.quantity) === 0) {
    cart = cart.filter((item) => item.consumable_id !== data.consumable_id);
  } else {
    const existingItem = cart.find(
      (item) => item.consumable_id === data.consumable_id
    );

    if (existingItem) {
      existingItem.quantity = data.quantity;
      existingItem.price = data.price;
    } else {
      cart.push(data);
    }
  }

  cart = cart.filter((item) => Number(item.quantity) > 0);

  localStorage.setItem(key, JSON.stringify(cart));

  $cartItemCount.textContent = cart.length;

  $showCart.parentElement.classList.remove("hidden");
  showCart(cart);
  removeItemFromCart();
}

function showCart(items) {
  const $showCart = document.getElementById("show-cart");
  const $cart = document.querySelector(".cart");

  if (!items || items.length === 0) {
    $cart.classList.remove("show");
    $showCart.parentElement.classList.add("hidden");
    return;
  }

  const $cartItems = $cart.querySelector(".cart__items");
  const $cartTotal = $cart.querySelector(".cart__total");

  $showCart.parentElement.classList.remove("hidden");
  $cartItems.innerHTML = "";

  items.forEach((item, i) => {
    $cartItems.innerHTML += `
    <li class="cart__item">
    <div class="cart__item__info">
      <img class="cart__item-image" src="${item.consumableImage}" alt="${
      item.consumableName
    }">
      <div class="cart__item-details">
      <span class="cart__item-name">${item.consumableName}</span>
      <span class="cart__item-quantity">${item.quantity}</span>
      <span class="cart__item-price">${item.price.toFixed(2)}</span>
      </div>
      </div>
      <button class="cart__item-remove btn btn--danger" data-index="${i}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</button>
    </li>`;
  });

  $cartTotal.innerHTML = `totaal: € ${items
    .reduce((acc, item) => acc + item.price, 0)
    .toFixed(2)}`;
}

function showCountOnInput(data) {
  data.forEach((item) => {
    const $input = document.querySelector(
      `[data-consumable-id="${item.consumable_id}"]`
    );

    if ($input) {
      $input.value = item.quantity;
    }
  });
}

function removeItemFromCart() {
  const $removeButtons = document.querySelectorAll(".cart__item-remove");
  const $cartItemCount = document.getElementById("item__count");

  $removeButtons.forEach(($button) => {
    $button.addEventListener("click", () => {
      const key = "cart";
      const cart = JSON.parse(localStorage.getItem(key)) || [];

      const index = parseInt($button.dataset.index);

      const removedItemId = cart[index].consumable_id;

      cart.splice(index, 1);

      const $input = document.querySelector(
        `[data-consumable-id="${removedItemId}"]`
      );

      if ($input) {
        $input.value = 0;

        const $form = $input.parentElement;
        if ($form) {
          $form.classList.remove("show");
        }
      }

      $cartItemCount.textContent = cart.length;

      localStorage.setItem(key, JSON.stringify(cart));
      showCart(cart);
    });
  });
}

function handleOrder(key) {
  const $orderBtn = document.getElementById("order-btn");

  $orderBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem(key) || []);
    if (cart.length === 0) {
      alert("Je hebt geen producten in je winkelwagentje.");
      return;
    }

    await addOrderToDb(cart);

    for (const item of cart) {
      await updateStock({ stock: item.quantity }, item.consumable_id);
    }

    clearInputs();

    localStorage.removeItem(key);

    showCart([]);
  });
}

function handleInstantOrder(key) {
  const $instantOrderbtn = document.getElementById("instant-order-btn");

  $instantOrderbtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem(key) || []);

    if (cart.length === 0) {
      alert("Je hebt geen producten in je winkelwagentje.");
      return;
    }

    const orderId = await addOrderToDb(cart);

    if (orderId) {
      const userId = cart[0].user_id;
      const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

      try {
        const response = await fetch(`create-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            orderId,
            userId,
            amount: totalPrice.toFixed(2),
          }),
        });

        localStorage.removeItem(key);
        showCart([]);
        clearInputs();

        for (const item of cart) {
          await updateStock({ stock: item.quantity }, item.consumable_id);
        }

        const paymentData = await response.json();

        window.location.href = paymentData.paymentUrl;
      } catch (err) {
        console.log("Fout bij het verwerken van de betaling:", err);
      }
    }
  });
}

function clearInputs() {
  const $inputs = document.querySelectorAll(".consumable__quantity");

  $inputs.forEach(($input) => {
    if ($input) {
      $input.value = 0;

      const $form = $input.parentElement;
      if ($form) {
        $form.classList.remove("show");
      }
    }
  });
}

async function updateStock(data, id) {
  try {
    const response = await fetch(`/api/consumables/${id}/stock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update stock");
    }

    const result = await response.json();
    console.log("Stock updated successfully:", result);
  } catch (error) {
    console.error("Error updating stock:", error);
  }
}

function handleAboveStockAmount() {
  const $quantityInputs = document.querySelectorAll(".consumable__quantity");

  $quantityInputs.forEach(($input) => {
    $input.addEventListener("input", () => {
      const stockAmount = parseInt($input.dataset.consumableStock);
      const currentValue = parseInt($input.value);

      if (currentValue > stockAmount) {
        alert(`De voorraad is niet voldoende. `);
        $input.value = stockAmount;
      }
    });
  });
}
