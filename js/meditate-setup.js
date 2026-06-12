(function () {
  const modeTitle = document.querySelector(".mode-title");
  const modeArt = document.querySelector(".mode-art");
  const modeLive = document.querySelector(".mode-live");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const durationGroup = document.querySelector(".duration-chips");
  const startBtn = document.querySelector(".btn-start");

  if (!modeTitle || !modeArt || !durationGroup || !startBtn) {
    return;
  }

  let modeIndex = MEDITATION_MODES.findIndex((mode) => mode.id === DEFAULT_MODE_ID);
  if (modeIndex < 0) {
    modeIndex = 0;
  }

  let selectedDuration = DEFAULT_DURATION;

  function renderMode() {
    const mode = MEDITATION_MODES[modeIndex];
    modeTitle.textContent = mode.label;
    modeArt.src = mode.poster;
    modeArt.alt = mode.alt;

    if (modeLive) {
      modeLive.textContent = `Selected mode: ${mode.label}`;
    }
  }

  function shiftMode(delta) {
    modeIndex = (modeIndex + delta + MEDITATION_MODES.length) % MEDITATION_MODES.length;
    renderMode();
  }

  function buildDurationChips() {
    durationGroup.innerHTML = "";

    MEDITATION_DURATIONS.forEach((minutes) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "duration-chip";
      chip.setAttribute("role", "radio");
      chip.setAttribute("aria-checked", String(minutes === selectedDuration));
      chip.dataset.duration = String(minutes);
      chip.textContent = formatDuration(minutes);

      if (minutes === selectedDuration) {
        chip.classList.add("is-selected");
      }

      chip.addEventListener("click", () => selectDuration(minutes));
      durationGroup.appendChild(chip);
    });
  }

  function selectDuration(minutes) {
    selectedDuration = minutes;

    durationGroup.querySelectorAll(".duration-chip").forEach((chip) => {
      const isSelected = Number(chip.dataset.duration) === minutes;
      chip.classList.toggle("is-selected", isSelected);
      chip.setAttribute("aria-checked", String(isSelected));
    });
  }

  prevBtn?.addEventListener("click", () => shiftMode(-1));
  nextBtn?.addEventListener("click", () => shiftMode(1));

  document.addEventListener("keydown", (event) => {
    if (event.target.closest(".duration-chips")) {
      return;
    }

    if (event.key === "ArrowLeft") {
      shiftMode(-1);
    }

    if (event.key === "ArrowRight") {
      shiftMode(1);
    }
  });

  startBtn.addEventListener("click", () => {
    const mode = MEDITATION_MODES[modeIndex];
    const params = new URLSearchParams({
      mode: mode.id,
      duration: String(selectedDuration),
    });
    window.location.href = `./session.html?${params.toString()}`;
  });

  renderMode();
  buildDurationChips();
})();
