import { addOrderToDb } from "./order.js";

export function InitConsumable() {
  const $consumables = document.querySelectorAll(".consumable");
  const $cart = document.querySelector(".cart");
  const $showCart = document.getElementById("show-cart");

  const key = "cart";
  const cart = JSON.parse(localStorage.getItem(key)) || [];
  if (cart.length > 0) {
    $showCart.parentElement.classList.remove("hidden");
    showCountOnInput(cart);
    handleShoppingCart(cart);
    handleOrder(cart, key);
    removeItemFromCart();
  } else {
    $cart.classList.remove("show");
    $showCart.parentElement.classList.add("hidden");
  }

  $showCart.addEventListener("click", () => {
    $cart.classList.add("show");
  });

  $consumables.forEach(($consumable) => {
    const $btn = $consumable.querySelector(".consumable__button");
    const $form = $consumable.querySelector(".consumable__form");

    const $quantityInput = $form.querySelector(".consumable__quantity");
    const $reduceBtn = $form.querySelector(".reduce-count");
    const $increaseBtn = $form.querySelector(".increase-count");

    $btn.addEventListener("click", (e) => {
      $form.classList.add("show");
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

  $showCart.parentElement.classList.remove("hidden");
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

  $cart.classList.add("show");
  $cartItems.innerHTML = "";

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

  $cartTotal.innerHTML = `totaal: € ${items.reduce(
    (acc, item) => acc + item.price,
    0
  )}`;
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

  $removeButtons.forEach(($button, index) => {
    $button.addEventListener("click", (e) => {
      const key = "cart";
      const cart = JSON.parse(localStorage.getItem(key)) || [];

      cart.splice(index, 1);

      localStorage.setItem(key, JSON.stringify(cart));
      showCart(cart);
    });
  });
}

function handleOrder(cart, key) {
  const $orderBtn = document.getElementById("order-btn");

  $orderBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Je hebt geen producten in je winkelwagentje.");
      return;
    }

    await addOrderToDb(cart);

    localStorage.removeItem(key);

    showCart([]);
  });
}
