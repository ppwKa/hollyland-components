/**
 * Hollyland Sticky CTA Bar — 首屏显隐 + 阅读进度
 */

const ROOT = ".hl-sticky-cta-bar";

function init() {
  const root = document.querySelector(ROOT);
  if (!root) return;

  const hero = root.querySelector("[data-sticky-cta-hero]");
  const bar = root.querySelector("[data-sticky-cta-bar]");
  const page = root.querySelector("[data-sticky-cta-page]");
  const progressEl = root.querySelector("[data-sticky-cta-progress]");

  if (!hero || !bar) return;

  const setVisible = (visible) => {
    bar.classList.toggle("is-visible", visible);
    bar.setAttribute("aria-hidden", visible ? "false" : "true");
    if (page) page.classList.toggle("is-bar-visible", visible);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setVisible(!entry.isIntersecting);
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px -1px 0px",
    }
  );

  observer.observe(hero);

  const updateProgress = () => {
    if (!progressEl) return;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = scrollHeight > 0 ? Math.min(100, (window.scrollY / scrollHeight) * 100) : 0;
    progressEl.style.transform = `scaleX(${p / 100})`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
