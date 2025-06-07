export default function initDropdown() {
  if (!document.querySelector(".dropdown")) {
    return;
  }
  const $button = document.querySelector(".dropdown-btn");
  const $loggedInUser = document.getElementById("logged-in-user");
  const $searchInputUsers = document.getElementById("search-input-users");
  const $searchUsers = document.querySelectorAll(".search-user");
  const $userIdOrder = document.querySelectorAll(".user-id-order");
  const $dropdownMenu = document.querySelector(".dropdown-content");
  let users = [];

  $searchUsers.forEach(($searchUser) => {
    users.push($searchUser.textContent);
    $searchUser.addEventListener("click", function (e) {
      const name = $searchUser.textContent;
      $loggedInUser.value = e.target.dataset.id;
      $userIdOrder.forEach(($userId) => {
        $userId.value = e.target.dataset.id;
      });

      if (name) {
        $button.textContent = name;
      }
      $dropdownMenu.classList.add("hidden");
    });
  });

  const $dropdowns = document.querySelectorAll(".dropdown");
  $dropdowns.forEach(($dropdown) => {
    const $button = $dropdown.querySelector(".dropdown-btn");
    const $menu = $dropdown.querySelector(".dropdown-content");
    $button.addEventListener("click", function (event) {
      event.stopPropagation();
      $menu.classList.toggle("hidden");
    });

    const $list = $menu.querySelector(".dropdown-list");

    $searchInputUsers.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      $list.innerHTML = "";

      if (searchTerm.length > 0 || searchTerm.length === 0) {
        const filteredUsers = users.filter((user) =>
          user.toLowerCase().includes(searchTerm)
        );

        $list.innerHTML = filteredUsers
          .map(
            (user) => `<li class="dropdown-item">
            <span class="search-user" data-user-id="${user.id}">${user}</span>
            </li>`
          )
          .join("");
      }
    });
  });
}
