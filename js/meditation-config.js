const MEDITATION_MODES = [
  {
    id: "silence",
    label: "Silence",
    alt: "Silence mode — calm green character in water",
    poster: "./assets/mode-silence.png",
    video: "./assets/videos/silence.mp4",
  },
  {
    id: "bloom",
    label: "Bloom",
    alt: "Bloom mode — hanging flower with golden tendrils",
    poster: "./assets/mode-bloom.png",
    video: "./assets/videos/bloom.mp4",
  },
  {
    id: "flow",
    label: "Flow",
    alt: "Flow mode — stylized ocean waves",
    poster: "./assets/mode-flow.png",
    video: "./assets/videos/flow.mp4",
  },
];

const MEDITATION_DURATIONS = [15, 30, 45, 60];

const DEFAULT_MODE_ID = "silence";
const DEFAULT_DURATION = 45;

function formatDuration(minutes) {
  return minutes === 60 ? "1 hr" : `${minutes} mins`;
}

function getModeById(id) {
  return MEDITATION_MODES.find((mode) => mode.id === id) ?? MEDITATION_MODES[0];
}

function getValidDuration(minutes) {
  const parsed = Number.parseInt(String(minutes), 10);
  return MEDITATION_DURATIONS.includes(parsed) ? parsed : DEFAULT_DURATION;
}
