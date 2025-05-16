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
      $quantityInput.value = 1;
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

    $form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData($form);
      const consumableId = formData.get("consumable_id");
      const quantity = formData.get("quantity");

      
    });
  });
}
