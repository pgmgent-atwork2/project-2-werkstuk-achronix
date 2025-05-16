export function showConsumableQuantityChange() {
  const $consumables = document.querySelectorAll(".consumable");

  $consumables.forEach(($consumable) => {
    const $btn = $consumable.querySelector(".consumable__button");
    const $form = $consumable.querySelector(".consumable__form");

    $btn.addEventListener("click", (e) => {
      console.log("Button clicked");
      $form.classList.add("show");
    });

    $form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData($form);
      const consumableId = formData.get("consumable_id");
      const quantity = formData.get("quantity");

      const $reduceBtn = $form.querySelector(".reduce-count");
      const $increaseBtn = $form.querySelector(".increase-count");
    });
  });
}
