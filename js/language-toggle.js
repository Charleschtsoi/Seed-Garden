(function () {
  const STORAGE_KEY = "seed-garden-lang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "tc" ? "tc" : "en";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "tc" ? "zh-Hant" : "en";
    apply(lang);
  }

  function t(key, lang) {
    const labels = window.I18N_LABELS ?? {};
    return labels[key]?.[lang] ?? labels[key]?.en ?? "";
  }

  function apply(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = t(key, lang);
      if (text) {
        el.textContent = text;
      }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    if (window.SeedGardenQuotes) {
      window.SeedGardenQuotes.applyQuote(lang);
    }

    if (window.SeedGardenGreeting) {
      window.SeedGardenGreeting.applyGreeting(lang);
    }

    if (window.SeedGardenCompanion) {
      window.SeedGardenCompanion.apply(lang);
    }

    document.dispatchEvent(new CustomEvent("seed-garden:lang", { detail: { lang } }));
  }

  function init() {
    const lang = getLang();
    document.documentElement.lang = lang === "tc" ? "zh-Hant" : "en";
    apply(lang);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  window.SeedGardenI18n = { getLang, setLang, apply, t };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
