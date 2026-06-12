(function () {
  const BASE_COUNT = 83;

  function companionCount() {
    const day = new Date().getDate();
    return BASE_COUNT + (day % 17);
  }

  function apply(lang) {
    const el = document.querySelector("[data-companion-count]");
    if (!el || !window.I18N_LABELS) return;

    const count = companionCount();
    const suffix = I18N_LABELS.companionCount[lang];
    el.textContent = lang === "tc" ? `${count} ${suffix}` : `${count} ${suffix}`;
  }

  window.SeedGardenCompanion = { apply, companionCount };
})();
