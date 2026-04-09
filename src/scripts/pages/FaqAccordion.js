/**
 * Hollyland FAQ Accordion — 动画、搜索、复制链接、键盘导航
 */

const ROOT = "[data-faq-root]";

function getAllItems(root) {
  return root.querySelectorAll(".faq-item");
}

function closeAll(root) {
  getAllItems(root).forEach((item) => {
    const btn = item.querySelector("[data-faq-trigger]");
    const panel = item.querySelector(".faq-panel");
    if (!btn || !panel) return;
    item.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
  });
}

function openItem(root, index1Based) {
  const item = root.querySelector(`[data-faq-index="${index1Based}"]`);
  if (!item || item.classList.contains("is-faq-filtered-out")) return;
  const btn = item.querySelector("[data-faq-trigger]");
  const panel = item.querySelector(".faq-panel");
  if (!btn || !panel) return;

  closeAll(root);
  item.classList.add("is-open");
  btn.setAttribute("aria-expanded", "true");
  panel.setAttribute("aria-hidden", "false");
  panel.removeAttribute("inert");
}

function parseHash(hash) {
  const m = /^#faq-(\d+)$/.exec(hash);
  if (!m) return null;
  return parseInt(m[1], 10);
}

function applyHash(root) {
  const n = parseHash(window.location.hash);
  if (n == null || n < 1) return;
  openItem(root, n);
  const item = root.querySelector(`[data-faq-index="${n}"]`);
  if (item) {
    requestAnimationFrame(() => {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
}

function showToast(root) {
  const toast = root.querySelector("[data-faq-toast]");
  if (!toast) return;
  toast.hidden = false;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.hidden = true;
  }, 2200);
}

function copyFaqLink(root, index1Based) {
  const hash = `#faq-${index1Based}`;
  const url = `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;
  const fallback = () => {
    prompt("复制链接：", url);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => showToast(root)).catch(fallback);
  } else {
    fallback();
  }
}

function initSearch(root) {
  const input = root.querySelector("[data-faq-search]");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    getAllItems(root).forEach((item) => {
      const text = (item.textContent || "").toLowerCase();
      const match = !q || text.includes(q);
      item.classList.toggle("is-faq-filtered-out", !match);
      if (!match && item.classList.contains("is-open")) {
        const btn = item.querySelector("[data-faq-trigger]");
        const panel = item.querySelector(".faq-panel");
        if (btn && panel) {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          panel.setAttribute("aria-hidden", "true");
          panel.setAttribute("inert", "");
        }
      }
    });
  });
}

function initKeyboard(root) {
  const list = root.querySelector("[data-faq-list]");
  if (!list) return;

  list.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const triggers = Array.from(
      root.querySelectorAll(".faq-item:not(.is-faq-filtered-out) [data-faq-trigger]")
    );
    const active = document.activeElement;
    const i = triggers.indexOf(active);
    if (i === -1) return;
    e.preventDefault();
    const next =
      e.key === "ArrowDown"
        ? triggers[i + 1] || triggers[0]
        : triggers[i - 1] || triggers[triggers.length - 1];
    next?.focus();
  });
}

function init() {
  const root = document.querySelector(ROOT);
  if (!root) return;

  root.addEventListener("click", (e) => {
    const copyBtn = e.target.closest("[data-faq-copy]");
    if (copyBtn && root.contains(copyBtn)) {
      e.preventDefault();
      e.stopPropagation();
      const n = parseInt(copyBtn.getAttribute("data-faq-copy") || "0", 10);
      if (n > 0) copyFaqLink(root, n);
      return;
    }

    const trigger = e.target.closest("[data-faq-trigger]");
    if (!trigger || !root.contains(trigger)) return;

    const item = trigger.closest(".faq-item");
    const panel = item?.querySelector(".faq-panel");
    if (!item || !panel) return;

    const expanded = trigger.getAttribute("aria-expanded") === "true";
    if (expanded) {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("inert", "");
    } else {
      closeAll(root);
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      panel.removeAttribute("inert");
    }
  });

  window.addEventListener("hashchange", () => applyHash(root));

  if (window.location.hash) {
    applyHash(root);
  }

  initSearch(root);
  initKeyboard(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
