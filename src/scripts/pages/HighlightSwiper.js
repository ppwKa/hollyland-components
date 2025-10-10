/**
 * Hollyland Highlight Swiper
 * 高亮轮播图
 */

class HighlightSwiperManager {
    constructor() {
        // 常量配置
        this.MOBILE_BREAKPOINT = 768;
        this.SELECTORS = {
            //加前缀：hl-highlight-swiper，避免与其他组件的类名冲突
            HighlightSwiperContainer: '.hl-highlight-swiper .highlight-swiper-container'
        }

        // 滚动事件处理器
        this.scrollHandlers = new Map();
        this.scrollTicking = false;

        // DOM元素缓存
        this.elements = {};

        // 初始化
        this.init();
    }

    /**
     * 初始化页面功能
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initAfterDOMLoaded());
        } else {
            this.initAfterDOMLoaded();
        }
    }

    /**
     * DOM加载完成后的初始化
     */
    initAfterDOMLoaded() {
        this.cacheElements();
        this.initScrollEvents();
        this.initHighlightEvents();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements.highlightSwiperContainer = document.querySelector(this.SELECTORS.HighlightSwiperContainer);
    }

    /**
     * 初始化滚动事件系统
     */
    initScrollEvents() {
        // 统一的滚动事件处理
        const handleScroll = () => {
            if (!this.scrollTicking) {
                requestAnimationFrame(() => {
                    // 执行所有注册的滚动处理器
                    this.scrollHandlers.forEach((handler, name) => {
                        try {
                            handler();
                        } catch (error) {
                            console.error(`scroll handler ${name} failed:`, error);
                        }
                    });

                    this.scrollTicking = false;
                });
                this.scrollTicking = true;
            }
        };

        // 添加滚动监听
        window.addEventListener('scroll', handleScroll, { passive: true });
        this.mainScrollHandler = handleScroll;
    }

    /**
     * 注册滚动处理器
     * @param {string} name - 处理器名称
     * @param {Function} handler - 处理器函数
     */
    registerScrollHandler(name, handler) {
        if (typeof handler !== 'function') {
            console.error(`scroll handler ${name} must be a function`);
            return;
        }

        this.scrollHandlers.set(name, handler);
    }

    /**
     * 移除滚动处理器
     * @param {string} name - 处理器名称
     */
    removeScrollHandler(name) {
        this.scrollHandlers.delete(name);
    }

    /**
     * 初始化highlight Events
     */
    initHighlightEvents() {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        if (!highlightSwiperContainer) return;

        const countContainerWidth = highlightSwiperContainer.querySelector('.highlight-swiper-wrapper').clientWidth;
        const containerBeforeWidth = (document.documentElement.clientWidth - countContainerWidth) / 2;
        const highlightSwiper = new Swiper(highlightSwiperContainer.querySelector('.highlight-swiper'), {
            slidesPerView: 1,
            spaceBetween: 10,
            speed: 1000,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            on: {
                slideChangeTransitionStart: (swiper) => {
                    this.handleSlideContent(swiper);
                },
                resize: function () {
                    const countContainerWidth = highlightSwiperContainer.querySelector('.highlight-swiper-wrapper').clientWidth;
                    const containerBeforeWidth = (document.documentElement.clientWidth - countContainerWidth) / 2;
                    this.params.width = countContainerWidth;
                    this.params.slidesOffsetBefore = containerBeforeWidth;
                    this.params.slidesOffsetAfter = -containerBeforeWidth;
                    this.update();
                },
                init: (swiper) => {
                    const pagEl = swiper.pagination.el;
                    const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
                    if (pagEl && buttonControl) {
                        const bullets = pagEl.querySelectorAll('.swiper-pagination-bullet');
                        if (bullets) {
                            bullets.forEach((bullet) => {
                                bullet.addEventListener('click', () => {
                                    const buttonControlState = buttonControl.getAttribute('data-state');
                                    if (buttonControlState === 'replay') {
                                        this.setPausedState(buttonControl);
                                    }
                                });
                            });
                        }
                    }
                },
                //点击事件
                tap: (swiper) => {
                    const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
                    if (buttonControl) {
                        const buttonControlState = buttonControl.getAttribute('data-state');
                        if (swiper.activeIndex === swiper.clickedIndex) {
                            if (buttonControlState === 'paused') {
                                this.setPlayingState(buttonControl);
                                cancelAnimationFrame(swiper.autoSlideAnimation);
                                swiper.autoSlideAnimation = null;
                                this.handleHighlightSwiperBullets(swiper, -1, 'after-active');
                            } else if (buttonControlState === 'playing') {
                                this.setPausedState(buttonControl);
                                this.handleSlideContent(swiper);
                            } else if (buttonControlState === 'replay') {
                                this.setPausedState(buttonControl);
                                swiper.slideTo(0);
                                this.handleSlideContent(swiper);
                            }
                        } else {
                            if (buttonControlState === 'paused' || buttonControlState === 'replay') {
                                this.setPausedState(buttonControl);
                            }
                            swiper.slideTo(swiper.clickedIndex);
                        }
                    }
                }
            },
            breakpoints: {
                768: {
                    allowTouchMove: false,
                    width: countContainerWidth,
                    spaceBetween: 20,
                    slidesOffsetBefore: containerBeforeWidth,
                    slidesOffsetAfter: -containerBeforeWidth,
                },
            },
        });

        //swiper events
        this.handleSwiperVisibility(highlightSwiper);
        this.handleSwiperPageVisibilityChange(highlightSwiper);
        this.initHighlightSwiperButtonControl(highlightSwiper);
        this.handleSwiperControlButtonVisibility(highlightSwiper);
    }

    /**
     * 初始化highlight swiper幻灯片按钮控制事件
     * 当按钮状态为暂停时，播放视频
     * 当按钮状态为播放时，暂停视频
     * 当按钮状态为重播时，重播视频
     * @param {Swiper} swiper - 幻灯片实例
     */
    initHighlightSwiperButtonControl(swiper) {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        if (!highlightSwiperContainer) return;

        const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
        if (buttonControl) {
            buttonControl.addEventListener('click', () => {
                const state = buttonControl.getAttribute('data-state');
                if (state === 'paused') {
                    this.setPlayingState(buttonControl);
                    cancelAnimationFrame(swiper.autoSlideAnimation);
                    swiper.autoSlideAnimation = null;
                    this.handleHighlightSwiperBullets(swiper, -1, 'after-active');
                } else if (state === 'playing') {
                    this.setPausedState(buttonControl);
                    this.handleSlideContent(swiper);
                } else if (state === 'replay') {
                    this.setPausedState(buttonControl);
                    swiper.slideTo(0);
                }
            });
        }
    }

    /**
     * 设置按钮状态为暂停
     * @param {HTMLElement} buttonControl - 按钮控制元素
     */
    setPausedState(buttonControl) {
        buttonControl.setAttribute("data-state", "paused");
    }

    /**
     * 设置按钮状态为播放
     * @param {HTMLElement} buttonControl - 按钮控制元素
     */
    setPlayingState(buttonControl) {
        buttonControl.setAttribute("data-state", "playing");
    }

    /**
     * 设置按钮状态为重播
     * @param {HTMLElement} buttonControl - 按钮控制元素
     */
    setReplayState(buttonControl) {
        buttonControl.setAttribute("data-state", "replay");
    }

    /**
     * 处理highlight swiper幻灯片内容
     * 定义swiper的自动动画逻辑
     * @param {Swiper} swiper - 幻灯片实例
     */
    handleSlideContent(swiper) {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        if (!highlightSwiperContainer) return;

        const currentSlide = swiper.slides[swiper.activeIndex];
        const allVideos = swiper.el.querySelectorAll('video');
        const activeVideos = currentSlide.querySelectorAll('video');
        const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
        if (buttonControl) {
            const buttonControlState = buttonControl.getAttribute('data-state');
            if (buttonControlState !== 'paused') {
                return;
            }
        }

        allVideos.forEach((video) => { video.pause(); })
        activeVideos.forEach((video) => { video.play().catch((err) => console.error('Video playback error:', err)); });

        const startTime = performance.now();
        const duration = 6000;
        const timelineActions = [
            { time: 0, action: () => this.handleHighlightSwiperBullets(swiper, swiper.realIndex, 'after-active') },
            {
                time: duration, action: () => {
                    if (swiper.activeIndex !== swiper.slides.length - 1) {
                        swiper.slideNext();
                    } else {
                        const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
                        if (buttonControl) {
                            this.setReplayState(buttonControl);
                        }
                    }
                }
            },
        ];

        function runTimeline(currentTime) {
            const elapsed = currentTime - startTime;
            timelineActions.forEach(({ time, action }) => {
                if (elapsed >= time && !action.done) {
                    action();
                    action.done = true; // Mark as executed
                }
            });

            if (elapsed < duration) {
                swiper.autoSlideAnimation = requestAnimationFrame(runTimeline);
            }
        }

        if (swiper.autoSlideAnimation) {
            cancelAnimationFrame(swiper.autoSlideAnimation);
        }
        swiper.autoSlideAnimation = requestAnimationFrame(runTimeline);
    }

    /**
     * 处理highlight swiper幻灯片Bullets
     * 当activeIndex发生变化时，切换对应的bullets的className
     * 当activeIndex为-1时，去掉所有bullets的className
     * @param {Swiper} swiper - 幻灯片实例
     */
    handleHighlightSwiperBullets(swiper, activeIndex, className) {
        const bullets = swiper.pagination.bullets;
        if (bullets) {
            bullets.forEach((bullet, bulletIndex) => {
                bullet.classList.toggle(className, bulletIndex === activeIndex);
            });
        }
    }

    /**
     * 处理highlight swiper幻灯片可见性变化
     * 当swiper完全出现在视口中时，播放视频
     * 当swiper完全离开视口中时，暂停视频
     * @param {Swiper} swiper - 幻灯片实例
     */
    handleSwiperVisibility(swiper) {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        if (!highlightSwiperContainer) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.handleSlideContent(swiper);
                    } else {
                        // Swiper is not visible, pause timeline
                        if (swiper.autoSlideAnimation) {
                            const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
                            if (!buttonControl || buttonControl.getAttribute('data-state') === 'paused') {
                                this.handleHighlightSwiperBullets(swiper, -1, 'after-active');
                            }
                            cancelAnimationFrame(swiper.autoSlideAnimation);
                            swiper.autoSlideAnimation = null;
                        }
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(swiper.el);
    }

    /**
     * 处理highlight swiper幻灯片页面可见性变化
     * 当页面可见时，播放视频
     * 当页面不可见时，暂停视频
     * @param {Swiper} swiper - 幻灯片实例
     */
    handleSwiperPageVisibilityChange(swiper) {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        if (!highlightSwiperContainer) return;

        document.addEventListener('visibilitychange', () => {
            if (!swiper.el) return;

            if (!document.hidden && swiper.el.getBoundingClientRect().top < window.innerHeight) {
                this.handleSlideContent(swiper);
            } else {
                if (swiper.autoSlideAnimation) {
                    const buttonControl = highlightSwiperContainer.querySelector('.swiper-button-control');
                    if (!buttonControl || buttonControl.getAttribute('data-state') === 'paused') {
                        this.handleHighlightSwiperBullets(swiper, -1, 'after-active');
                    }
                    cancelAnimationFrame(swiper.autoSlideAnimation);
                    swiper.autoSlideAnimation = null;
                }
            }
        });
    }

    /**
     * observer highlight swiper
     * 当swiper完全出现在视口中时，显示.swiper-control-pagination
     * 当swiper完全离开视口中时，隐藏.swiper-control-pagination
     * @param {Swiper} swiper - 幻灯片实例
     */
    handleSwiperControlButtonVisibility(swiper) {
        const highlightSwiperContainer = this.elements.highlightSwiperContainer;
        const swiperControlPagination = highlightSwiperContainer.querySelector('.swiper-control-pagination');
        if (!highlightSwiperContainer || !swiperControlPagination) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !swiperControlPagination.classList.contains('animate-show')) {
                        swiperControlPagination.classList.add('animate-show');
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(swiper.el);
    }
}

// 初始化页面管理器
const highlightSwiperManager = new HighlightSwiperManager();

// 导出管理器实例（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HighlightSwiperManager;
}