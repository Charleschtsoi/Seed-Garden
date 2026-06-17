(function () {
  const POS_KEY = "seed-garden-mate-position";
  const MODE_KEY = "seed-garden-mate-mode";
  const TALK_INDEX_KEY = "seed-garden-mate-talk-index";

  const SMALL_TALK = [
    { en: "Breathe. You are here.", tc: "呼吸。你在這裡。" },
    { en: "Stillness is enough for now.", tc: "此刻，寧靜就夠了。" },
    { en: "One quiet moment at a time.", tc: "一次，一刻寧靜。" },
    { en: "The garden waits with patience.", tc: "園子耐心地等著你。" },
    { en: "Notice the space between thoughts.", tc: "留意念頭之間的空隙。" },
  ];

  const REMINDER_INTERVAL_MS = 45000;
  const TALK_INTERVAL_MS = 35000;

  let mode = "silent";
  let reminderTimer = null;
  let talkTimer = null;
  let dragState = null;
  let didDrag = false;

  function getLang() {
    return window.SeedGardenI18n?.getLang?.() ?? "en";
  }

  function t(key) {
    return window.SeedGardenI18n?.t?.(key, getLang()) ?? "";
  }

  function getStage() {
    return document.getElementById("mate-stage");
  }

  function getWidget() {
    return document.getElementById("mate-widget");
  }

  function getBubble() {
    return document.getElementById("mate-bubble");
  }

  function clampPosition(x, y, widget, stage) {
    const stageRect = stage.getBoundingClientRect();
    const widgetRect = widget.getBoundingClientRect();
    const halfW = widgetRect.width / 2;
    const halfH = widgetRect.height / 2;

    const minX = halfW;
    const maxX = stageRect.width - halfW;
    const minY = halfH;
    const maxY = stageRect.height - halfH;

    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  }

  function applyPosition(x, y) {
    const widget = getWidget();
    const stage = getStage();
    if (!widget || !stage) return;

    const clamped = clampPosition(x, y, widget, stage);
    widget.style.left = `${clamped.x}px`;
    widget.style.top = `${clamped.y}px`;
    widget.style.transform = "translate(-50%, -50%)";
  }

  function savePosition() {
    const widget = getWidget();
    const stage = getStage();
    if (!widget || !stage) return;

    const left = Number.parseFloat(widget.style.left);
    const top = Number.parseFloat(widget.style.top);
    if (Number.isNaN(left) || Number.isNaN(top)) return;

    const stageRect = stage.getBoundingClientRect();
    localStorage.setItem(
      POS_KEY,
      JSON.stringify({
        xPct: left / stageRect.width,
        yPct: top / stageRect.height,
      })
    );
  }

  function restorePosition() {
    const widget = getWidget();
    const stage = getStage();
    if (!widget || !stage) return;

    const raw = localStorage.getItem(POS_KEY);
    if (!raw) {
      applyPosition(stage.clientWidth * 0.5, stage.clientHeight * 0.55);
      return;
    }

    try {
      const { xPct, yPct } = JSON.parse(raw);
      applyPosition(stage.clientWidth * xPct, stage.clientHeight * yPct);
    } catch {
      applyPosition(stage.clientWidth * 0.5, stage.clientHeight * 0.55);
    }
  }

  function resetPosition() {
    localStorage.removeItem(POS_KEY);
    const stage = getStage();
    if (stage) {
      applyPosition(stage.clientWidth * 0.5, stage.clientHeight * 0.55);
    }
    hideBubble();
  }

  function hideBubble() {
    const bubble = getBubble();
    if (bubble) {
      bubble.hidden = true;
      bubble.innerHTML = "";
    }
  }

  function showBubble(html) {
    const bubble = getBubble();
    if (!bubble) return;
    bubble.innerHTML = html;
    bubble.hidden = false;
  }

  function nextTalkLine() {
    const index = Number.parseInt(localStorage.getItem(TALK_INDEX_KEY) ?? "0", 10);
    const line = SMALL_TALK[index % SMALL_TALK.length];
    localStorage.setItem(TALK_INDEX_KEY, String((index + 1) % SMALL_TALK.length));
    return getLang() === "tc" ? line.tc : line.en;
  }

  function showTalkBubble() {
    if (mode !== "talk") return;
    const text = nextTalkLine();
    showBubble(
      `<p>${text}</p><button type="button" class="mate-bubble-dismiss" data-dismiss-bubble>${t("desktopDismiss")}</button>`
    );
  }

  function showReminderBubble() {
    if (mode !== "reminder") return;
    showBubble(
      `<p>${t("desktopReminderText")}</p><a class="mate-bubble-link" href="./meditate.html">${t("desktopReminderAction")}</a><button type="button" class="mate-bubble-dismiss" data-dismiss-bubble>${t("desktopDismiss")}</button>`
    );
  }

  function clearTimers() {
    if (reminderTimer) {
      clearInterval(reminderTimer);
      reminderTimer = null;
    }
    if (talkTimer) {
      clearInterval(talkTimer);
      talkTimer = null;
    }
  }

  function setMode(nextMode) {
    mode = nextMode;
    localStorage.setItem(MODE_KEY, mode);
    clearTimers();
    hideBubble();

    document.querySelectorAll(".mate-mode-btn").forEach((btn) => {
      const active = btn.getAttribute("data-mode") === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    if (mode === "talk") {
      showTalkBubble();
      talkTimer = window.setInterval(showTalkBubble, TALK_INTERVAL_MS);
    } else if (mode === "reminder") {
      window.setTimeout(showReminderBubble, 8000);
      reminderTimer = window.setInterval(showReminderBubble, REMINDER_INTERVAL_MS);
    }
  }

  function onPointerDown(event) {
    const widget = getWidget();
    const stage = getStage();
    if (!widget || !stage || event.button > 0) return;

    const rect = widget.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - (rect.left + rect.width / 2),
      offsetY: event.clientY - (rect.top + rect.height / 2),
      stageRect,
    };
    didDrag = false;

    widget.classList.add("is-dragging");
    widget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const stage = getStage();
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const x = event.clientX - stageRect.left - dragState.offsetX;
    const y = event.clientY - stageRect.top - dragState.offsetY;
    const moved =
      Math.abs(event.clientX - dragState.startX) > 5 ||
      Math.abs(event.clientY - dragState.startY) > 5;
    if (moved) {
      didDrag = true;
    }
    applyPosition(x, y);
  }

  function onPointerUp(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const widget = getWidget();
    if (widget) {
      widget.classList.remove("is-dragging");
      widget.releasePointerCapture(event.pointerId);
    }

    dragState = null;
    savePosition();
  }

  function onWidgetClick(event) {
    if (didDrag || mode !== "talk") return;
    if (event.target.closest("[data-dismiss-bubble]")) return;
    showTalkBubble();
  }

  function onBubbleClick(event) {
    if (event.target.matches("[data-dismiss-bubble]")) {
      hideBubble();
    }
  }

  function onLangChange() {
    if (mode === "reminder") {
      const bubble = getBubble();
      if (bubble && !bubble.hidden) {
        showReminderBubble();
      }
    }
  }

  function init() {
    const widget = getWidget();
    const stage = getStage();
    const bubble = getBubble();
    if (!widget || !stage) return;

    restorePosition();
    window.addEventListener("resize", () => restorePosition());

    widget.addEventListener("pointerdown", onPointerDown);
    widget.addEventListener("pointermove", onPointerMove);
    widget.addEventListener("pointerup", onPointerUp);
    widget.addEventListener("pointercancel", onPointerUp);
    widget.addEventListener("click", onWidgetClick);

    if (bubble) {
      bubble.addEventListener("click", onBubbleClick);
    }

    document.querySelectorAll(".mate-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.getAttribute("data-mode")));
    });

    const resetBtn = document.querySelector("[data-reset-mate-position]");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetPosition);
    }

    document.addEventListener("seed-garden:lang", onLangChange);

    const savedMode = localStorage.getItem(MODE_KEY);
    setMode(savedMode === "talk" || savedMode === "reminder" ? savedMode : "silent");

    const img = widget.querySelector("img");
    if (img && !img.complete) {
      img.addEventListener("load", restorePosition, { once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
