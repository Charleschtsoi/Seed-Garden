(function () {
  const QUOTE_DATE_KEY = "seed-garden-quote-date";
  const QUOTE_INDEX_KEY = "seed-garden-quote-index";

  const quotes = [
    {
      en: "Silence is the best reply to a fool.",
      tc: "沉默是對愚者最好的回應。",
      attribution: { en: "— Zen teaching", tc: "——禪語" },
    },
    {
      en: "The mind is everything. What you think, you become.",
      tc: "心是一切。你想什麼，便成什麼。",
      attribution: { en: "— Buddha", tc: "——佛陀" },
    },
    {
      en: "Do not dwell in the past. Do not dream of the future. Concentrate the mind on the present moment.",
      tc: "不滯於過去，不迷於將來，安住於此刻。",
      attribution: { en: "— Buddha", tc: "——佛陀" },
    },
    {
      en: "When walking, walk. When eating, eat.",
      tc: "行時行，食時食。",
      attribution: { en: "— Zen proverb", tc: "——禪語" },
    },
    {
      en: "Let go or be dragged.",
      tc: "放下，或被牽引。",
      attribution: { en: "— Zen proverb", tc: "——禪語" },
    },
    {
      en: "The obstacle is the path.",
      tc: "障礙即是道路。",
      attribution: { en: "— Zen proverb", tc: "——禪語" },
    },
    {
      en: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.",
      tc: "開悟前，砍柴擔水。開悟後，砍柴擔水。",
      attribution: { en: "— Zen proverb", tc: "——禪語" },
    },
  ];

  function localDateKey() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function resolveQuoteIndex() {
    const today = localDateKey();
    const storedDate = localStorage.getItem(QUOTE_DATE_KEY);
    const storedIndex = Number.parseInt(localStorage.getItem(QUOTE_INDEX_KEY), 10);

    if (storedDate === today && !Number.isNaN(storedIndex) && storedIndex >= 0) {
      return storedIndex % quotes.length;
    }

    const nextIndex =
      storedDate && !Number.isNaN(storedIndex)
        ? (storedIndex + 1) % quotes.length
        : Math.abs(today.split("-").join("")) % quotes.length;

    localStorage.setItem(QUOTE_DATE_KEY, today);
    localStorage.setItem(QUOTE_INDEX_KEY, String(nextIndex));
    return nextIndex;
  }

  function applyQuote(lang) {
    const el = document.querySelector("[data-daily-quote]");
    const cite = document.querySelector("[data-daily-quote-attribution]");
    if (!el) return;

    const quote = quotes[resolveQuoteIndex()];
    const text = lang === "tc" ? quote.tc : quote.en;
    el.textContent = `\u201c${text}\u201d`;

    if (cite && quote.attribution) {
      cite.textContent = lang === "tc" ? quote.attribution.tc : quote.attribution.en;
    }
  }

  window.SeedGardenQuotes = { applyQuote, quotes, resolveQuoteIndex, localDateKey };
  applyQuote(document.documentElement.lang === "zh-Hant" ? "tc" : "en");
})();
