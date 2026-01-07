/**
 * Hollyland Scroll Counter
 * 滚动数字计数器组件
 *
 * @description 当元素进入视口时，数字从0动态增长到目标值
 *
 * @example
 * <span class="counter-value" data-target="1000" data-duration="2000">0</span>
 */

class ScrollCounterManager {
  constructor() {
    this.SELECTORS = {
      section: ".hl-scroll-counter .counter-section",
      counter: ".hl-scroll-counter .counter-value",
      item: ".hl-scroll-counter .counter-item",
    };

    this.animatedElements = new Set();
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    const counters = document.querySelectorAll(this.SELECTORS.counter);
    if (counters.length === 0) return;

    // 使用 IntersectionObserver 监听进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;

            // 防止重复动画
            if (this.animatedElements.has(counter)) return;
            this.animatedElements.add(counter);

            // 开始计数动画
            this.animateCounter(counter);

            // 停止观察
            observer.unobserve(counter);
          }
        });
      },
      {
        threshold: 0.5, // 元素50%进入视口时触发
        rootMargin: "0px 0px -100px 0px", // 提前100px触发
      }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /**
   * 执行计数动画
   * @param {HTMLElement} element - 计数器元素
   */
  animateCounter(element) {
    const target = parseFloat(element.dataset.target) || 0;
    const duration = parseInt(element.dataset.duration) || 2000;
    const decimals = parseInt(element.dataset.decimals) || 0;
    const item = element.closest(this.SELECTORS.item.replace(".hl-scroll-counter ", ""));

    let startTime = null;
    const startValue = 0;

    // 缓动函数 - easeOutExpo
    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    // 格式化数字（千分位）
    const formatNumber = (num, dec) => {
      if (dec > 0) {
        return num.toLocaleString("en-US", {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec,
        });
      }
      return Math.round(num).toLocaleString("en-US");
    };

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 应用缓动
      const easedProgress = easeOutExpo(progress);
      const currentValue = startValue + (target - startValue) * easedProgress;

      // 更新显示
      element.textContent = formatNumber(currentValue, decimals);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成
        element.textContent = formatNumber(target, decimals);
        if (item) {
          item.classList.add("is-complete");
        }
      }
    };

    // 开始动画
    element.classList.add("is-animating");
    requestAnimationFrame(animate);

    // 动画结束后移除动画类
    setTimeout(() => {
      element.classList.remove("is-animating");
    }, duration);
  }

  /**
   * 手动触发指定计数器
   * @param {string} selector - CSS选择器
   */
  trigger(selector) {
    const element = document.querySelector(selector);
    if (element && !this.animatedElements.has(element)) {
      this.animatedElements.add(element);
      this.animateCounter(element);
    }
  }

  /**
   * 重置所有计数器
   */
  reset() {
    const counters = document.querySelectorAll(this.SELECTORS.counter);
    counters.forEach((counter) => {
      counter.textContent = "0";
      const item = counter.closest(this.SELECTORS.item.replace(".hl-scroll-counter ", ""));
      if (item) item.classList.remove("is-complete");
    });
    this.animatedElements.clear();
  }
}

// 初始化
const scrollCounterManager = new ScrollCounterManager();

if (typeof module !== "undefined" && module.exports) {
  module.exports = ScrollCounterManager;
}