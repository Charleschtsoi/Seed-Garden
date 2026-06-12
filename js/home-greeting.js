(function () {
  function greetingKey() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "greetingMorning";
    if (hour >= 12 && hour < 17) return "greetingAfternoon";
    if (hour >= 17 && hour < 22) return "greetingEvening";
    return "greetingNight";
  }

  function applyGreeting(lang) {
    const el = document.querySelector("[data-home-greeting]");
    if (!el || !window.I18N_LABELS) return;

    const period = I18N_LABELS[greetingKey()][lang];
    const name = I18N_LABELS.practitionerName[lang];
    const separator = lang === "tc" ? "，" : ", ";
    el.textContent = `${period}${separator}${name}`;
  }

  window.SeedGardenGreeting = { applyGreeting, greetingKey };
})();
