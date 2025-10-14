/**
 * Hollyland Scene Swiper
 * 场景轮播图
 */

class SceneSwiperManager {
    constructor() {
        // 常量配置
        this.MOBILE_BREAKPOINT = 768;
        this.SELECTORS = {
            //加前缀：hl-scene-swiper，避免与其他组件的类名冲突
            SceneSwiperContainer: '.hl-scene-swiper .scene-swiper-container'
        }

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
        this.initSceneSwiperEvents();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements.sceneSwiperContainer = document.querySelector(this.SELECTORS.SceneSwiperContainer);
    }

    /**
     * 初始化scene swiper Events
     */
    initSceneSwiperEvents() {
        const sceneSwiperContainer = this.elements.sceneSwiperContainer;
        if (!sceneSwiperContainer) return;

        const countContainerWidth = sceneSwiperContainer.querySelector('.scene-swiper-wrapper').clientWidth;
        const containerBeforeWidth = (document.documentElement.clientWidth - countContainerWidth) / 2;
        const sceneSwiper = new Swiper(sceneSwiperContainer.querySelector('.scene-swiper'), {
            slidesPerView: 1,
            spaceBetween: 10,
            speed: 800,
            navigation: {
                nextEl: sceneSwiperContainer.querySelector('.scene-swiper-btn .swiper-button-next'),
                prevEl: sceneSwiperContainer.querySelector('.scene-swiper-btn .swiper-button-prev'),
            },
            on: {
                resize: function () {
                    if (window.innerWidth > 768) {
                        const countContainerWidth = sceneSwiperContainer.querySelector('.scene-swiper-wrapper').clientWidth;
                        const containerBeforeWidth = (document.documentElement.clientWidth - countContainerWidth) / 2;
                        this.params.width = (countContainerWidth - 20) / 2;
                        this.params.slidesOffsetBefore = containerBeforeWidth;
                        this.params.slidesOffsetAfter = -containerBeforeWidth;
                        this.update();
                    }else{
                        this.params.slidesOffsetBefore = 0;
                        this.params.slidesOffsetAfter = 0;
                        this.update();
                    }
                },
            },
            breakpoints: {
                768: {
                    allowTouchMove: false,
                    width: (countContainerWidth - 20) / 2,
                    spaceBetween: 20,
                    slidesOffsetBefore: containerBeforeWidth,
                    slidesOffsetAfter: -containerBeforeWidth,
                },
                480: {
                    spaceBetween: 30,
                    width: 560,
                },
                320: {
                    spaceBetween: 15,
                    width: 280,
                },
            },
        });
    }
}

// 初始化页面管理器
const sceneSwiperManager = new SceneSwiperManager();

// 导出管理器实例（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SceneSwiperManager;
}