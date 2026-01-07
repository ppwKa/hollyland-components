/**
 * Hollyland Before After Compare
 * 图片对比滑块组件
 * 
 * @description 支持鼠标拖拽和触摸滑动的图片对比组件
 */

class BeforeAfterCompareManager {
  constructor() {
    this.SELECTORS = {
      container: ".hl-before-after-compare .before-after-compare",
    };

    this.instances = [];
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
    const containers = document.querySelectorAll(this.SELECTORS.container);
    containers.forEach((container) => this.initCompare(container));
  }

  /**
   * 初始化单个对比组件
   * @param {HTMLElement} container - 容器元素
   */
  initCompare(container) {
    const beforeLayer = container.querySelector(".compare-before");
    const handle = container.querySelector(".compare-handle");
    const initialPosition = parseInt(container.dataset.initial) || 50;

    if (!beforeLayer || !handle) return;

    // 设置初始位置
    this.setPosition(container, beforeLayer, handle, initialPosition);

    // 状态变量
    let isDragging = false;

    // 获取位置百分比
    const getPositionPercent = (clientX) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      return Math.max(0, Math.min(100, percent));
    };

    // 更新位置
    const updatePosition = (clientX) => {
      const percent = getPositionPercent(clientX);
      this.setPosition(container, beforeLayer, handle, percent);
    };

    // 鼠标事件
    const onMouseDown = (e) => {
      isDragging = true;
      container.classList.add("is-dragging");
      handle.classList.add("dragging");
      updatePosition(e.clientX);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");
      handle.classList.remove("dragging");
    };

    // 触摸事件
    const onTouchStart = (e) => {
      isDragging = true;
      container.classList.add("is-dragging");
      handle.classList.add("dragging");
      updatePosition(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isDragging = false;
      container.classList.remove("is-dragging");
      handle.classList.remove("dragging");
    };

    // 键盘支持（无障碍）
    const onKeyDown = (e) => {
      const currentLeft = parseFloat(handle.style.left) || 50;
      let newPosition = currentLeft;

      switch (e.key) {
        case "ArrowLeft":
          newPosition = Math.max(0, currentLeft - 2);
          break;
        case "ArrowRight":
          newPosition = Math.min(100, currentLeft + 2);
          break;
        default:
          return;
      }

      e.preventDefault();
      this.setPosition(container, beforeLayer, handle, newPosition);
    };

    // 绑定事件
    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    // 键盘支持
    container.setAttribute("tabindex", "0");
    container.setAttribute("role", "slider");
    container.setAttribute("aria-valuenow", initialPosition);
    container.setAttribute("aria-valuemin", "0");
    container.setAttribute("aria-valuemax", "100");
    container.addEventListener("keydown", onKeyDown);

    // 存储实例信息
    this.instances.push({
      container,
      beforeLayer,
      handle,
      cleanup: () => {
        container.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
        container.removeEventListener("keydown", onKeyDown);
      },
    });
  }

  /**
   * 设置对比位置
   */
  setPosition(container, beforeLayer, handle, percent) {
    beforeLayer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
    container.setAttribute("aria-valuenow", Math.round(percent));
  }

  /**
   * 销毁所有实例
   */
  destroyAll() {
    this.instances.forEach((instance) => instance.cleanup());
    this.instances = [];
  }
}

// 初始化
const beforeAfterCompareManager = new BeforeAfterCompareManager();

if (typeof module !== "undefined" && module.exports) {
  module.exports = BeforeAfterCompareManager;
}