document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      hamburger.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      const isMobile = window.innerWidth < 768;
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (
        isMobile &&
        !isClickInsideSidebar &&
        !isClickOnHamburger &&
        sidebar.classList.contains("open")
      ) {
        sidebar.classList.remove("open");
        hamburger.classList.remove("active");
      }
    });
  }
});
