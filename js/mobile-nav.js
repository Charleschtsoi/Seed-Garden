(function () {
  function init() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!header || !toggle || !nav) return;

    function setOpen(open) {
      header.classList.toggle("site-header--nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("site-header--nav-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
      if (event.matches) {
        setOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
