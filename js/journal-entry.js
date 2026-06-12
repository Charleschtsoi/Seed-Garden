(function () {
  const STORAGE_KEY = "seed-garden-journal-entries";
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const duration = params.get("duration");
  const mood = params.get("mood");

  const form = document.querySelector(".journal-form");
  const textarea = document.querySelector(".journal-textarea");
  const savedMessage = document.querySelector(".journal-saved");
  const recentList = document.querySelector(".journal-recent-list");
  const contextLine = document.querySelector(".journal-context");

  function getLang() {
    return window.SeedGardenI18n?.getLang() ?? "en";
  }

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function moodLabel(id) {
    const map = {
      calm: "moodCalm",
      grateful: "moodGrateful",
      tired: "moodTired",
      anxious: "moodAnxious",
      sad: "moodSad",
      clear: "moodClear",
    };
    const key = map[id];
    return key ? window.I18N_LABELS[key][getLang()] : id;
  }

  function renderContext() {
    if (!contextLine) return;

    const parts = [];
    if (mode) {
      const modeObj = getModeById(mode);
      parts.push(modeObj.label);
    }
    if (duration) {
      parts.push(`${duration} min`);
    }
    if (mood) {
      parts.push(moodLabel(mood));
    }

    contextLine.textContent = parts.length ? parts.join(" · ") : "";
    contextLine.hidden = parts.length === 0;
  }

  function renderRecent() {
    if (!recentList) return;

    const entries = loadEntries();
    const lang = getLang();
    recentList.innerHTML = "";

    if (!entries.length) {
      recentList.hidden = true;
      return;
    }

    recentList.hidden = false;
    entries.slice(0, 5).forEach((entry) => {
      const item = document.createElement("li");
      item.className = "journal-recent-item";

      const date = new Date(entry.createdAt).toLocaleString(lang === "tc" ? "zh-HK" : "en-HK", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      const moodText = entry.mood ? moodLabel(entry.mood) : "";

      const meta = document.createElement("span");
      meta.className = "journal-recent-meta";
      meta.textContent = moodText ? `${date} · ${moodText}` : date;

      const body = document.createElement("p");
      body.textContent = entry.text || "—";

      item.append(meta, body);
      recentList.appendChild(item);
    });
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = textarea?.value.trim() ?? "";
    const entry = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      text,
      mood: mood ?? null,
      mode: mode ?? null,
      duration: duration ? Number(duration) : null,
      createdAt: new Date().toISOString(),
    };

    const entries = [entry, ...loadEntries()].slice(0, 20);
    saveEntries(entries);

    if (textarea) {
      textarea.value = "";
    }

    if (savedMessage) {
      savedMessage.hidden = false;
      window.setTimeout(() => {
        savedMessage.hidden = true;
      }, 3200);
    }

    renderRecent();

    if (window.history.replaceState) {
      const clean = new URL(window.location.href);
      clean.search = "";
      window.history.replaceState({}, "", clean.toString());
      if (contextLine) {
        contextLine.hidden = true;
      }
    }
  });

  document.addEventListener("seed-garden:lang", () => {
    renderContext();
    renderRecent();
  });

  renderContext();
  renderRecent();
})();
