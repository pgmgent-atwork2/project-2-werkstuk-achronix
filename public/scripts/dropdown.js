export default function initDropdown() {
  if (!document.querySelector(".dropdown")) {
    return;
  }
  const $dropdowns = document.querySelectorAll(".dropdown");
  $dropdowns.forEach(($dropdown) => {
    const $button = $dropdown.querySelector(".dropdown-btn");
    const $menu = $dropdown.querySelector(".dropdown-content");
    $button.addEventListener("click", function (event) {
      event.stopPropagation();
      $menu.classList.toggle("hidden");
    });
  });
}
