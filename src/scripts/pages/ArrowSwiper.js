/**
 * Hollyland Arrow Swiper
 * 箭头导航轮播图组件
 * 
 * @description 一个支持响应式布局、自动对齐 Bootstrap container 的 Swiper 轮播组件
 * 
 * @example
 * // 基础用法 - 在 HTML 中添加 data-swiper-id 属性
 * <div class="swiper arrow-swiper" data-swiper-id="my-swiper">...</div>
 * 
 * @example
 * // 手动初始化自定义配置
 * arrowSwiperManager.initResponsiveSwiper({
 *   swiperSelector: '.my-swiper',
 *   alignWithContainer: true,
 *   alignNavToContainerRight: true,
 *   options: { slidesPerView: 3 }
 * });
 */

class ArrowSwiperManager {
  constructor() {
    // 常量配置
    this.MOBILE_BREAKPOINT = 992;

    this.SELECTORS = {
      container: ".hl-arrow-swiper .arrow-swiper-section",
      swiper: ".hl-arrow-swiper .arrow-swiper",
    };

    // Swiper实例存储
    this.swiperInstances = new Map();

    // 初始化
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initAfterDOMLoaded()
      );
    } else {
      this.initAfterDOMLoaded();
    }
  }

  /**
   * DOM加载完成后初始化
   */
  initAfterDOMLoaded() {
    this.initAllSwipers();
  }

  /**
   * 初始化所有Arrow Swiper实例
   */
  initAllSwipers() {
    const swiperContainers = document.querySelectorAll(this.SELECTORS.swiper);

    swiperContainers.forEach((container) => {
      const swiperId =
        container.dataset.swiperId || `arrow-swiper-${Date.now()}`;
      const calculatorId = `${swiperId}-calculator`;

      this.initResponsiveSwiper({
        swiperSelector: `[data-swiper-id="${swiperId}"]`,
        swiperId: swiperId,
        alignWithContainer: true,
        fullSlideWidth: false,
        alignNavToSlide: true,
        alignNavToContainerRight: true,
        alignPaginationToSlide: () => window.innerWidth > 768,
        options: {
          slidesPerView: "auto",
          spaceBetween: 20,
          speed: 700,
          navigation: {
            nextEl: `[data-swiper-id="${swiperId}"] .swiper-button-next`,
            prevEl: `[data-swiper-id="${swiperId}"] .swiper-button-prev`,
          },
        },
        containerSelector: `#${calculatorId}`,
      });
    });
  }

  /**
   * 初始化响应式 Swiper 实例
   * 
   * @description 创建一个功能丰富的 Swiper 实例，支持多种对齐和布局选项
   * 
   * @param {Object} config - 配置对象
   * 
   * @param {string} config.swiperSelector - 【必填】Swiper 容器的 CSS 选择器
   *   示例: '.my-swiper', '[data-swiper-id="xxx"]'
   * 
   * @param {string} [config.swiperId] - 【可选】Swiper 实例的唯一标识符
   *   用途: 用于存储和获取 Swiper 实例，方便后续调用 getInstance()/destroy() 方法
   *   示例: 'product-gallery'
   * 
   * @param {Object} [config.options={}] - 【可选】Swiper 原生配置项
   *   说明: 直接传递给 new Swiper() 的配置，支持所有 Swiper 官方配置
   *   常用配置:
   *     - slidesPerView: 'auto' | number  // 可见slide数量
   *     - spaceBetween: number            // slide间距(px)
   *     - speed: number                   // 切换动画速度(ms)
   *     - loop: boolean                   // 是否循环
   *     - centeredSlides: boolean         // 是否居中显示当前slide
   *     - navigation: { nextEl, prevEl }  // 导航按钮选择器
   *     - pagination: { el, clickable }   // 分页器配置
   * 
   * @param {boolean} [config.alignWithContainer=false] - 【布局】是否将 Swiper 左侧与 container 对齐
   *   效果: 开启后，第一个 slide 的左边缘会与 Bootstrap container 的左边缘对齐
   *   场景: 适用于全宽 Swiper 但内容需要与页面主体内容对齐的情况
   *   原理: 自动计算 slidesOffsetBefore 和 slidesOffsetAfter 偏移量
   * 
   * @param {boolean} [config.fullSlideWidth=false] - 【布局】是否将每个 slide 宽度设置为 container 宽度
   *   效果: 开启后，每个 slide 宽度等于 container 内容区宽度（不含 padding）
   *   场景: 适用于一次只显示一张全宽图片的轮播
   *   注意: 通常与 alignWithContainer: true 配合使用
   * 
   * @param {boolean} [config.alignNavToSlide=false] - 【导航】是否将导航按钮定位到 slide 区域
   *   效果: 开启后，左右箭头会显示在当前 slide 的右下角区域
   *   场景: 适用于需要按钮跟随内容区域的设计
   *   计算: 基于 slide 宽度和 centeredSlides 状态动态计算位置
   * 
   * @param {boolean|Function} [config.alignPaginationToSlide=false] - 【分页】是否将分页器对齐到 slide 左侧
   *   效果: 开启后，分页器（小圆点）会显示在 slide 内容区的左下角
   *   类型: 
   *     - boolean: 直接开启/关闭
   *     - Function: 返回 boolean 的函数，可根据屏幕宽度动态判断
   *   示例: () => window.innerWidth > 768  // 仅在 PC 端生效
   * 
   * @param {boolean} [config.alignNavToContainerRight=false] - 【导航】是否将导航按钮对齐到 container 右边缘
   *   效果: 开启后，左右箭头会固定在 Bootstrap container 的右侧
   *   场景: 适用于标题和按钮都需要在 container 内的设计
   *   注意: 与 alignNavToSlide 互斥，同时开启时后者会覆盖前者的部分设置
   * 
   * @param {string} [config.containerSelector='.container'] - 【基准】对齐参照的容器选择器
   *   说明: 上述所有对齐选项都以此容器为基准进行计算
   *   示例: '.container', '#section-6-calculator', '.custom-wrapper'
   * 
   * @returns {Swiper|null} 返回 Swiper 实例，如果初始化失败则返回 null
   * 
   * @example
   * // 示例1: 基础左对齐轮播
   * this.initResponsiveSwiper({
   *   swiperSelector: '.gallery-swiper',
   *   alignWithContainer: true,
   *   options: { slidesPerView: 'auto', spaceBetween: 20 }
   * });
   * 
   * @example
   * // 示例2: 全宽单张图片轮播，按钮在右侧
   * this.initResponsiveSwiper({
   *   swiperSelector: '.hero-swiper',
   *   alignWithContainer: true,
   *   fullSlideWidth: true,
   *   alignNavToContainerRight: true,
   *   options: { speed: 800, loop: true }
   * });
   * 
   * @example
   * // 示例3: 居中显示，按钮跟随slide
   * this.initResponsiveSwiper({
   *   swiperSelector: '.product-swiper',
   *   alignNavToSlide: true,
   *   options: { centeredSlides: true, slidesPerView: 3 }
   * });
   */
  initResponsiveSwiper({
    swiperSelector,
    swiperId,
    options = {},
    alignWithContainer = false,
    fullSlideWidth = false,
    alignNavToSlide = false,
    alignPaginationToSlide = false,
    alignNavToContainerRight = false,
    containerSelector = ".container",
  }) {
    const swiperEl = document.querySelector(swiperSelector);

    if (!swiperEl) {
      console.warn(
        `[ArrowSwiperManager] 找不到swiper容器: ${swiperSelector}`
      );
      return null;
    }

    // 确保Swiper已加载
    if (typeof Swiper === "undefined") {
      console.warn("[ArrowSwiperManager] Swiper库未加载");
      return null;
    }

    const self = this;

    const swiper = new Swiper(swiperSelector, {
      ...options,
      on: {
        init: function () {
          const { slidesOffsetBefore, slidesOffsetAfter } =
            self.calculateSwiperOffset({
              swiperEl,
              containerSelector,
            });

          if (alignWithContainer) {
            this.params.slidesOffsetBefore = slidesOffsetBefore;
            this.params.slidesOffsetAfter = slidesOffsetAfter;
          }

          if (alignNavToSlide) {
            self.updateSwiperNavPosition({ swiper: this, swiperEl });
          }

          if (alignNavToContainerRight) {
            self.updateSwiperNavToContainerRight({
              swiperEl,
              containerSelector,
            });
          }

          const shouldAlignPagination =
            typeof alignPaginationToSlide === "function"
              ? alignPaginationToSlide()
              : alignPaginationToSlide;

          if (shouldAlignPagination) {
            self.updateSwiperPaginationPosition({
              swiper: this,
              swiperEl,
              slidesOffsetBefore,
            });
          }

          this.update();
        },
        resize: function () {
          if (fullSlideWidth) {
            self.applySlideWidthToMatchContainer({
              swiperEl,
              containerSelector,
            });
          }

          const { slidesOffsetBefore, slidesOffsetAfter } =
            self.calculateSwiperOffset({
              swiperEl,
              containerSelector,
            });

          if (alignWithContainer) {
            this.params.slidesOffsetBefore = slidesOffsetBefore;
            this.params.slidesOffsetAfter = slidesOffsetAfter;
          }

          if (alignNavToSlide) {
            self.updateSwiperNavPosition({ swiper: this, swiperEl });
          }

          if (alignNavToContainerRight) {
            self.updateSwiperNavToContainerRight({
              swiperEl,
              containerSelector,
            });
          }

          const shouldAlignPagination =
            typeof alignPaginationToSlide === "function"
              ? alignPaginationToSlide()
              : alignPaginationToSlide;

          if (shouldAlignPagination) {
            self.updateSwiperPaginationPosition({
              swiper: this,
              swiperEl,
              slidesOffsetBefore,
            });
          }

          this.update();
        },
      },
    });

    // 存储实例
    if (swiperId) {
      this.swiperInstances.set(swiperId, swiper);
    }

    return swiper;
  }

  /**
   * 将所有 slide 的宽度设置为 container 的内容宽度
   * 
   * @description 遍历所有 .swiper-slide 元素，将其宽度设置为 container 的纯内容宽度（不含 padding）
   * 
   * @param {Object} params - 参数对象
   * @param {HTMLElement} params.swiperEl - Swiper 容器 DOM 元素
   * @param {string} [params.containerSelector='.container'] - 参照容器的 CSS 选择器
   * 
   * @private
   */
  applySlideWidthToMatchContainer({
    swiperEl,
    containerSelector = ".container",
  }) {
    const container = document.querySelector(containerSelector);
    if (!container || !swiperEl) {
      return;
    }

    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const contentWidth = container.clientWidth - paddingLeft - paddingRight;

    const swiperSlides = swiperEl.querySelectorAll(".swiper-slide");
    swiperSlides.forEach((slide) => {
      slide.style.width = `${contentWidth}px`;
    });
  }

  /**
   * 计算 Swiper 的左右偏移量，使其与指定容器对齐
   * 
   * @description 
   * 计算 slidesOffsetBefore（左侧偏移）和 slidesOffsetAfter（右侧偏移），
   * 使 Swiper 的第一个 slide 左边缘与目标容器的左边缘对齐
   * 
   * @param {Object} params - 参数对象
   * @param {HTMLElement} params.swiperEl - Swiper 容器 DOM 元素
   * @param {string} params.containerSelector - 目标对齐容器的 CSS 选择器
   * 
   * @returns {Object} 偏移量对象
   * @returns {number} returns.slidesOffsetBefore - 左侧偏移量（px）
   * @returns {number} returns.slidesOffsetAfter - 右侧偏移量（px）
   * 
   * @private
   */
  calculateSwiperOffset({ swiperEl, containerSelector }) {
    if (!swiperEl) {
      return { slidesOffsetBefore: 0, slidesOffsetAfter: 0 };
    }

    const swiper = swiperEl.swiper;
    const targetEl = document.querySelector(containerSelector);

    if (!swiper || !targetEl) {
      return { slidesOffsetBefore: 0, slidesOffsetAfter: 0 };
    }

    const targetRect = targetEl.getBoundingClientRect();
    const swiperRect = swiperEl.getBoundingClientRect();

    const slidesOffsetBefore = Math.max(targetRect.left - swiperRect.left, 0);

    const slideWidth = swiper.slides[0]?.offsetWidth || 0;
    const spaceBetween = parseFloat(swiper.params.spaceBetween) || 0;
    const slidesPerView = swiper.params.slidesPerView;
    const containerWidth = swiperEl.offsetWidth;

    let slidesCount;
    if (slidesPerView === "auto") {
      slidesCount = Math.min(
        containerWidth / (slideWidth + spaceBetween),
        swiper.slides.length
      );
    } else {
      slidesCount = parseFloat(slidesPerView) || 1;
    }

    const slidesOffsetAfter = Math.max(
      slideWidth * (slidesCount - 1) +
        spaceBetween * (slidesCount - 1) -
        slidesOffsetBefore,
      0
    );

    return { slidesOffsetBefore, slidesOffsetAfter };
  }

  /**
   * 更新导航按钮位置，使其对齐到当前 slide 区域
   * 
   * @description 
   * 根据 slide 宽度和是否居中显示，动态计算左右箭头按钮的位置。
   * - 居中模式: 按钮显示在 slide 右下角
   * - 非居中模式: 按钮基于 slidesOffsetBefore 偏移量定位
   * 
   * @param {Object} params - 参数对象
   * @param {Swiper} params.swiper - Swiper 实例
   * @param {HTMLElement} params.swiperEl - Swiper 容器 DOM 元素
   * 
   * @private
   */
  updateSwiperNavPosition({ swiper, swiperEl }) {
    if (!swiper || !swiperEl) {
      return;
    }

    const slideWidth = swiper.slides[0]?.offsetWidth || 0;
    const nextButton = swiperEl.querySelector(".swiper-button-next");
    const prevButton = swiperEl.querySelector(".swiper-button-prev");
    const gap = window.innerWidth > 768 ? 16 : 12;

    if (nextButton && prevButton) {
      if (swiper.params.centeredSlides) {
        nextButton.style.left = `calc(50% + ${slideWidth / 2 - 32}px)`;
        prevButton.style.left = `calc(50% + ${slideWidth / 2 - 64 - gap}px)`;
      } else {
        const offset = swiper.params.slidesOffsetBefore || 0;
        nextButton.style.left = `${slideWidth + offset - 32}px`;
        prevButton.style.left = `${slideWidth + offset - 64 - gap}px`;
      }
    }
  }

  /**
   * 更新分页器位置，使其对齐到 slide 内容区
   * 
   * @description 
   * 根据 slide 宽度和是否居中显示，动态设置分页器的水平位置。
   * - 居中模式: 分页器左对齐到 slide 左边缘
   * - 非居中模式: 分页器基于 slidesOffsetBefore 偏移量定位
   * 
   * @param {Object} params - 参数对象
   * @param {Swiper} params.swiper - Swiper 实例
   * @param {HTMLElement} params.swiperEl - Swiper 容器 DOM 元素
   * @param {number} params.slidesOffsetBefore - 左侧偏移量
   * 
   * @private
   */
  updateSwiperPaginationPosition({ swiper, swiperEl, slidesOffsetBefore }) {
    if (!swiper || !swiperEl) {
      return;
    }

    const slideWidth = swiper.slides[0]?.offsetWidth || 0;
    const pagination = swiperEl.querySelector(".swiper-pagination");

    if (pagination && swiper.params.centeredSlides) {
      pagination.style.left = `calc(50% - ${slideWidth / 2}px)`;
    } else if (pagination && !swiper.params.centeredSlides) {
      pagination.style.left = `${slidesOffsetBefore}px`;
    }
  }

  /**
   * 将导航按钮对齐到 container 的右边缘
   * 
   * @description 
   * 计算 Swiper 容器与目标 container 的右边距差值，
   * 将 prev/next 按钮固定在 container 右侧区域。
   * 适用于标题与按钮需要在同一 container 宽度内的布局。
   * 
   * @param {Object} params - 参数对象
   * @param {HTMLElement} params.swiperEl - Swiper 容器 DOM 元素
   * @param {string} [params.containerSelector='.container'] - 目标容器的 CSS 选择器
   * 
   * @private
   */
  updateSwiperNavToContainerRight({
    swiperEl,
    containerSelector = ".container",
  }) {
    if (!swiperEl) {
      return;
    }

    const container = document.querySelector(containerSelector);
    const nextButton = swiperEl.querySelector(".swiper-button-next");
    const prevButton = swiperEl.querySelector(".swiper-button-prev");

    if (!container || !nextButton || !prevButton) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const swiperRect = swiperEl.getBoundingClientRect();

    const offsetRight = swiperRect.right - containerRect.right;

    nextButton.style.right = `${offsetRight + 5}px`;
    prevButton.style.right = `${offsetRight + 55}px`;
  }

  /**
   * 获取指定 ID 的 Swiper 实例
   * 
   * @description 通过 swiperId 获取已初始化的 Swiper 实例，可用于手动控制轮播
   * 
   * @param {string} swiperId - 初始化时设置的 Swiper ID
   * @returns {Swiper|undefined} Swiper 实例，如果不存在则返回 undefined
   * 
   * @example
   * const swiper = arrowSwiperManager.getInstance('my-swiper');
   * swiper.slideNext(); // 手动切换到下一张
   * 
   * @public
   */
  getInstance(swiperId) {
    return this.swiperInstances.get(swiperId);
  }

  /**
   * 销毁指定 ID 的 Swiper 实例
   * 
   * @description 完全销毁 Swiper 实例并从管理器中移除，释放内存和事件监听
   * 
   * @param {string} swiperId - 要销毁的 Swiper ID
   * 
   * @example
   * arrowSwiperManager.destroy('my-swiper');
   * 
   * @public
   */
  destroy(swiperId) {
    const swiper = this.swiperInstances.get(swiperId);
    if (swiper) {
      swiper.destroy(true, true);
      this.swiperInstances.delete(swiperId);
    }
  }

  /**
   * 销毁所有已初始化的 Swiper 实例
   * 
   * @description 遍历并销毁管理器中所有的 Swiper 实例，清空实例存储
   * 
   * @example
   * // 页面卸载时调用
   * arrowSwiperManager.destroyAll();
   * 
   * @public
   */
  destroyAll() {
    this.swiperInstances.forEach((swiper) => {
      swiper.destroy(true, true);
    });
    this.swiperInstances.clear();
  }
}

// 初始化管理器
const arrowSwiperManager = new ArrowSwiperManager();

// 导出（如果需要在其他地方使用）
if (typeof module !== "undefined" && module.exports) {
  module.exports = ArrowSwiperManager;
}

