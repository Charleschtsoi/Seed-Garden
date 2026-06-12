(function () {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") ?? DEFAULT_MODE_ID;
  const duration = params.get("duration") ?? String(DEFAULT_DURATION);

  const moods = [
    { id: "calm", key: "moodCalm", emoji: "🌿" },
    { id: "grateful", key: "moodGrateful", emoji: "🙏" },
    { id: "tired", key: "moodTired", emoji: "🌙" },
    { id: "anxious", key: "moodAnxious", emoji: "🌊" },
    { id: "sad", key: "moodSad", emoji: "🍃" },
    { id: "clear", key: "moodClear", emoji: "✨" },
  ];

  const moodGroup = document.querySelector(".mood-chips");
  const continueBtn = document.querySelector(".btn-check-in-continue");
  const skipLink = document.querySelector(".check-in-skip");

  if (!moodGroup || !continueBtn) {
    return;
  }

  let selectedMood = null;

  function getLang() {
    return window.SeedGardenI18n?.getLang() ?? "en";
  }

  function renderMoods() {
    const lang = getLang();
    moodGroup.innerHTML = "";

    moods.forEach((mood) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mood-chip";
      btn.dataset.mood = mood.id;
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<span class="mood-emoji" aria-hidden="true">${mood.emoji}</span><span class="mood-label">${window.I18N_LABELS[mood.key][lang]}</span>`;
      btn.addEventListener("click", () => selectMood(mood.id, btn));
      moodGroup.appendChild(btn);
    });
  }

  function selectMood(id, btn) {
    selectedMood = id;
    moodGroup.querySelectorAll(".mood-chip").forEach((chip) => {
      const active = chip === btn;
      chip.classList.toggle("is-selected", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    continueBtn.disabled = false;
  }

  function goToJournal() {
    const next = new URLSearchParams({ mode, duration });
    if (selectedMood) {
      next.set("mood", selectedMood);
    }
    window.location.href = `./journal.html?${next.toString()}`;
  }

  continueBtn.addEventListener("click", goToJournal);

  if (skipLink) {
    skipLink.href = `./journal.html?mode=${encodeURIComponent(mode)}&duration=${encodeURIComponent(duration)}`;
  }

  document.addEventListener("seed-garden:lang", renderMoods);
  renderMoods();
})();
