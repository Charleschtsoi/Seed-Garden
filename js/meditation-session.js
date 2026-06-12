(function () {
  const params = new URLSearchParams(window.location.search);
  const mode = getModeById(params.get("mode") ?? DEFAULT_MODE_ID);
  const duration = getValidDuration(params.get("duration"));
  const isDemo = params.get("demo") === "1";

  const modeLabel = document.querySelector(".session-mode-label");
  const timerDisplay = document.querySelector(".session-timer");
  const video = document.querySelector(".session-video");
  const videoFallback = document.querySelector(".session-video-fallback");
  const fallbackArt = document.querySelector(".session-video-fallback img");
  const playBtn = document.querySelector(".btn-session-play");
  const endBtn = document.querySelector(".btn-session-end");

  if (!timerDisplay || !video || !videoFallback) {
    return;
  }

  let remainingSeconds = isDemo ? 8 : duration * 60;
  let timerId = null;
  let isRunning = false;
  let videoAvailable = false;
  let hasCompleted = false;

  if (modeLabel) {
    modeLabel.textContent = mode.label;
  }

  if (fallbackArt) {
    fallbackArt.src = mode.poster;
    fallbackArt.alt = mode.alt;
  }

  video.poster = mode.poster;
  video.src = mode.video;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
    isRunning = false;
  }

  function goToCompletion() {
    if (hasCompleted) {
      return;
    }

    hasCompleted = true;
    stopTimer();
    video.pause();

    const next = new URLSearchParams({
      mode: mode.id,
      duration: String(duration),
    });
    window.location.href = `./complete.html?${next.toString()}`;
  }

  function startTimer() {
    if (isRunning || remainingSeconds <= 0) {
      return;
    }

    isRunning = true;
    timerId = window.setInterval(() => {
      remainingSeconds -= 1;
      updateTimerDisplay();

      if (remainingSeconds <= 0) {
        goToCompletion();
      }
    }, 1000);
  }

  function showVideoFallback() {
    videoAvailable = false;
    videoFallback.hidden = false;
    video.classList.add("is-hidden");
  }

  function tryPlayVideo() {
    if (!videoAvailable) {
      showVideoFallback();
      return;
    }

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        showVideoFallback();
      });
    }
  }

  video.addEventListener("error", showVideoFallback);

  video.addEventListener("loadeddata", () => {
    videoAvailable = true;
    videoFallback.hidden = true;
    video.classList.remove("is-hidden");
  });

  playBtn?.addEventListener("click", () => {
    tryPlayVideo();
    startTimer();
    playBtn.hidden = true;
  });

  endBtn?.addEventListener("click", () => {
    stopTimer();
    video.pause();
    window.location.href = "./meditate.html";
  });

  updateTimerDisplay();
})();
